import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class QuizService {
    constructor(
        private prisma: PrismaService,
        private ai: AiService,
    ) { }

    async generateQuestions(materialId: string, userId: string) {
        const material = await this.prisma.material.findFirst({
            where: { id: materialId, userId },
        });
        if (!material) throw new NotFoundException('Material not found');

        // Get average mastery for this user to adapt difficulty
        const progress = await this.prisma.progress.findMany({ where: { userId } });
        const avgMastery = progress.length
            ? Math.round(progress.reduce((acc, curr) => acc + curr.masteryLevel, 0) / progress.length)
            : 50;

        const questions = await this.ai.generateQuestions(material.content, 10, avgMastery);

        // Save questions to database
        const savedQuestions = await Promise.all(
            questions.map((q) =>
                this.prisma.question.create({
                    data: {
                        materialId,
                        type: q.type,
                        questionText: q.questionText,
                        difficulty: q.difficulty,
                        options: q.options ? JSON.stringify(q.options) : null,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        subTopic: q.subTopic,
                    },
                }),
            ),
        );

        return savedQuestions;
    }

    async submitAnswer(userId: string, questionId: string, studentAnswer: string) {
        const question = await this.prisma.question.findUnique({
            where: { id: questionId },
            include: { material: true },
        });
        if (!question) throw new NotFoundException('Question not found');

        const evaluation = await this.ai.evaluateAnswer(
            question.material.content,
            question.questionText,
            studentAnswer,
            question.correctAnswer,
        );

        const attempt = await this.prisma.attempt.create({
            data: {
                userId,
                questionId,
                studentAnswer,
                score: evaluation.score,
                isCorrect: evaluation.isCorrect,
                feedback: evaluation.feedback,
                explanation: evaluation.explanation,
                analogy: evaluation.analogy,
                memoryTrick: evaluation.memoryTrick,
                realWorldExample: evaluation.realWorldExample,
            },
        });

        // Update progress
        if (question.subTopic) {
            await this.updateProgress(userId, question.subTopic, evaluation.score);
        }

        return attempt;
    }

    private async updateProgress(userId: string, topic: string, score: number) {
        const existing = await this.prisma.progress.findFirst({
            where: { userId, topic },
        });

        if (existing) {
            const newLevel = Math.round((existing.masteryLevel + score) / 2); // Simple moving average
            await this.prisma.progress.update({
                where: { id: existing.id },
                data: { masteryLevel: newLevel, lastAttemptAt: new Date() },
            });
        } else {
            await this.prisma.progress.create({
                data: { userId, topic, masteryLevel: score },
            });
        }
    }

    async getPerformance(userId: string) {
        const attempts = await this.prisma.attempt.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: { question: { select: { questionText: true, subTopic: true } } }
        });

        const progress = await this.prisma.progress.findMany({
            where: { userId },
        });

        return { attempts, progress };
    }

    async getMistakesForReview(userId: string) {
        const mistakes = await this.prisma.attempt.findMany({
            where: {
                userId,
                isCorrect: false
            },
            include: {
                question: {
                    include: {
                        material: {
                            select: { title: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return mistakes;
    }

    async generateRevisionQuiz(userId: string) {
        const weakTopics = await this.prisma.progress.findMany({
            where: { userId, masteryLevel: { lt: 60 } },
            orderBy: { masteryLevel: 'asc' },
            take: 3,
        });

        if (weakTopics.length === 0) {
            throw new NotFoundException('No weak topics found for revision.');
        }

        // Get a material that contains one of these topics
        // For simplicity, we'll just pick the first weak topic and find a material
        const targetTopic = weakTopics[0];
        const material = await this.prisma.material.findFirst({
            where: { userId, content: { contains: targetTopic.topic } }
        });

        if (!material) throw new NotFoundException('Source material for weak topic not found.');

        return this.generateQuestions(material.id, userId);
    }
}
