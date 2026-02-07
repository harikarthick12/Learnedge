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
            console.log(`[MaterialsService] Starting creation for user: ${userId}, Title: ${title}`);

            // Ensure guest user exists
            if (userId === 'guest-user') {
                console.log('[MaterialsService] Upserting guest-user...');
                await this.prisma.user.upsert({
                    where: { id: 'guest-user' },
                    update: {},
                    create: {
                        id: 'guest-user',
                        email: 'guest@learnedge.com',
                        password: 'guest-password-placeholder',
                        name: 'Guest Scholar',
                    },
                });
            } else {
                const user = await this.prisma.user.findUnique({ where: { id: userId } });
                if (!user) {
                    console.error(`[MaterialsService] User ${userId} not found.`);
                    throw new NotFoundException('User not found.');
                }
            }

            console.log(`[MaterialsService] Sending content to AI for analysis. Content length: ${content.length}`);
            const analysis = await this.ai.analyzeMaterial(content);
            console.log('[MaterialsService] AI Analysis successful.');

            const material = await this.prisma.material.create({
                data: {
                    userId,
                    title,
                    content,
                    topicAnalysis: JSON.stringify(analysis), // Storing both topics and conceptGraph
                },
            });
            console.log(`[MaterialsService] Material saved successfully with ID: ${material.id}`);
            return material;
        } catch (error) {
            console.error('[MaterialsService] CRITICAL ERROR during material creation:');
            console.error(error);
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(error.message || 'Failed to process material');
        }
    }

    async getExplanation(content: string, style: 'CHILD' | 'EXAM' | 'CODE' | 'ANALOGY') {
        return this.ai.explainInStyle(content, style);
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
        const size = file.size;
        console.log(`[MaterialsService] Extracting text. Mime: ${mimetype}, Size: ${size} bytes`);

        try {
            if (mimetype === 'application/pdf') {
                console.log('[MaterialsService] Parsing PDF with pdf-parse...');

                // Handle different ways pdf-parse might be exported
                let pdfParser: any = pdf;
                let isClass = false;

                if (typeof pdfParser !== 'function') {
                    if (pdfParser.PDFParse) {
                        pdfParser = pdfParser.PDFParse;
                        isClass = true;
                    } else if (pdfParser.default) {
                        pdfParser = pdfParser.default;
                        if (typeof pdfParser !== 'function' && pdfParser.PDFParse) {
                            pdfParser = pdfParser.PDFParse;
                            isClass = true;
                        }
                    }
                }

                if (typeof pdfParser !== 'function') {
                    console.error('[MaterialsService] pdf-parse import failed to provide a function. Available keys:', Object.keys(pdf));
                    throw new Error('PDF parsing engine not found or invalid');
                }

                let text = '';
                if (isClass) {
                    const parser = new pdfParser({ data: file.buffer });
                    const result = await parser.getText();
                    text = result.text;
                    await parser.destroy();
                } else {
                    const data = await pdfParser(file.buffer);
                    text = data.text || '';
                }
                console.log(`[MaterialsService] PDF parsed. Extracted characters: ${text?.length || 0}`);
                return text || '';
            }

            if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                console.log('[MaterialsService] Parsing DOCX with mammoth...');
                const data = await mammoth.extractRawText({ buffer: file.buffer });
                console.log(`[MaterialsService] DOCX parsed. Extracted characters: ${data.value?.length || 0}`);
                return data.value || '';
            }

            console.log('[MaterialsService] Processing as plain text...');
            const text = file.buffer.toString('utf-8');
            console.log(`[MaterialsService] Text read. Length: ${text.length}`);
            return text;
        } catch (error) {
            console.error('[MaterialsService] Extraction failure:', error);
            throw new InternalServerErrorException(`File processing failed: ${error.message}`);
        }
    }
}
