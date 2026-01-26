import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
const pdf = require('pdf-parse');
import * as mammoth from 'mammoth';

@Injectable()
export class MaterialsService {
    constructor(
        private prisma: PrismaService,
        private ai: AiService,
    ) { }

    async create(userId: string, title: string, content: string) {
        try {
            console.log('[Step 1] Verifying User... ID:', userId);
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (!user) throw new NotFoundException('User not found. Please log out and log back in.');

            console.log('[Step 2] Sending content to Gemini... Size:', content.length);
            const topics = await this.ai.analyzeMaterial(content);
            console.log('[Step 3] AI success. Saving material...');

            const material = await this.prisma.material.create({
                data: {
                    userId,
                    title,
                    content,
                    topicAnalysis: JSON.stringify(topics),
                },
            });
            console.log('[Step 4] Material created! ID:', material.id);
            return material;
        } catch (error) {
            console.error('--- FAIL LOG ---', error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error.message || 'Failed to process material');
        }
    }

    async findAll(userId: string) {
        return this.prisma.material.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        return this.prisma.material.findFirst({
            where: { id, userId },
            include: { questions: true },
        });
    }

    async extractText(file: Express.Multer.File): Promise<string> {
        if (!file) throw new BadRequestException('No file provided');

        const mimetype = file.mimetype;
        console.log('[Extract] Start. Mime:', mimetype, 'Size:', file.size);

        try {
            if (mimetype === 'application/pdf') {
                console.log('[Extract] Parsing PDF...');
                // Handle different module resolution strategies for pdf-parse
                const pdfParser = typeof pdf === 'function' ? pdf : pdf.default;
                if (typeof pdfParser !== 'function') {
                    throw new Error('PDF parser engine failed to load correctly');
                }
                const data = await pdfParser(file.buffer);
                console.log('[Extract] PDF parsed. Text length:', data.text?.length);
                return data.text || '';
            }

            if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log('[Extract] Parsing DOCX...');
                const data = await mammoth.extractRawText({ buffer: file.buffer });
                console.log('[Extract] DOCX parsed. Text length:', data.value?.length);
                return data.value || '';
            }

            console.log('[Extract] Assuming plain text...');
            const text = file.buffer.toString('utf-8');
            console.log('[Extract] Text read. Length:', text.length);
            return text;
        } catch (error) {
            console.error('[Extract] CRITICAL ERROR:', error);
            throw new InternalServerErrorException(`File processing failed: ${error.message}`);
        }
    }
}
