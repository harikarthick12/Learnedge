import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class StudyService {
    constructor(
        private prisma: PrismaService,
        private ai: AiService,
    ) { }

    async createStudyPlan(userId: string, materialId: string, dailyMinutes: number, syllabusSize: string) {
        const material = await this.prisma.material.findFirst({
            where: { id: materialId, userId },
        });

        if (!material) throw new NotFoundException('Material not found');

        const planData = await this.ai.generateStudyPlan(material.content, dailyMinutes, syllabusSize);

        return this.prisma.studyPlan.create({
            data: {
                userId,
                title: `Plan for ${material.title}`,
                syllabusSize,
                dailyTimeBudget: dailyMinutes,
                tasks: JSON.stringify(planData),
                isCompleted: false,
            },
        });
    }

    async getPlans(userId: string) {
        return this.prisma.studyPlan.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getConfidenceMetrics(userId: string) {
        const progress = await this.prisma.progress.findMany({
            where: { userId },
            orderBy: { lastAttemptAt: 'desc' },
        });

        return progress.map(p => ({
            topic: p.topic,
            mastery: p.masteryLevel,
            confidence: p.confidence,
            attempts: p.totalAttempts,
            successRate: p.totalAttempts > 0 ? (p.correctCount / p.totalAttempts) * 100 : 0
        }));
    }
}
