import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey && apiKey !== 'your_key_here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        }
    }

    private ensureAiReady() {
        if (!this.genAI) {
            throw new Error('GEMINI_API_KEY is not set or is still the default in server/.env. AI features are disabled.');
        }
    }

    async generateContent(prompt: string): Promise<string> {
        this.ensureAiReady();
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error) {
            console.error('AI_ERROR_MSG:', error.message);
            throw new Error(`AI_FAIL: ${error.message}`);
        }
    }

    async generateJson(prompt: string): Promise<any> {
        const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. Do not include markdown formatting or extra text.`;
        const text = await this.generateContent(fullPrompt);
        try {
            const firstBrace = text.indexOf('{');
            const firstBracket = text.indexOf('[');
            let startIndex = -1;
            if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
                startIndex = firstBrace;
            } else if (firstBracket !== -1) {
                startIndex = firstBracket;
            }
            if (startIndex === -1) throw new Error('No JSON structure found');
            const lastBrace = text.lastIndexOf('}');
            const lastBracket = text.lastIndexOf(']');
            const endIndex = Math.max(lastBrace, lastBracket);
            const cleanJson = text.substring(startIndex, endIndex + 1).trim();
            return JSON.parse(cleanJson);
        } catch (error) {
            console.error('JSON_PARSE_FAIL:', error.message);
            throw new Error('AI returned invalid JSON');
        }
    }

    async analyzeMaterial(content: string) {
        const prompt = `Act as an expert academic tutor. Analyze the following study material and extract the core concepts and subtopics.
    Return a JSON array of objects: [{ "topic": "Name", "description": "Desc", "difficulty": "EASY" | "MEDIUM" | "HARD" }]
    Content: ${content.substring(0, 15000)}`;
        return this.generateJson(prompt);
    }

    async generateQuestions(content: string, count: number = 10, masteryLevel: number = 50) {
        const prompt = `Generate ${count} exam questions. Mastery Level: ${masteryLevel}%.
    Return as JSON array: [{ "type": "MCQ" | "SHORT" | "LONG", "questionText": "...", "difficulty": "...", "options": [...], "correctAnswer": "...", "explanation": "...", "subTopic": "..." }]
    Content: ${content.substring(0, 15000)}`;
        return this.generateJson(prompt);
    }

    async evaluateAnswer(context: string, question: string, studentAnswer: string, idealAnswer: string) {
        const prompt = `Evaluate answer. Return JSON: { "score": 0-100, "isCorrect": boolean, "feedback": "...", "explanation": "...", "analogy": "...", "memoryTrick": "...", "realWorldExample": "..." }
    Question: ${question}
    Student: ${studentAnswer}
    Ideal: ${idealAnswer}`;
        return this.generateJson(prompt);
    }
}
