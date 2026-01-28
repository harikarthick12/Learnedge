import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('[AiService] Initializing. API Key present:', !!apiKey);
        if (apiKey && apiKey !== 'your_key_here') {
            this.genAI = new GoogleGenerativeAI(apiKey);
            // Explicitly set the API version to 'v1' to ensure model compatibility
            this.model = this.genAI.getGenerativeModel(
                { model: 'gemini-1.5-flash' },
                { apiVersion: 'v1' }
            );
        }
    }

    private ensureAiReady() {
        if (!this.genAI) {
            console.error('[AiService] GEMINI_API_KEY is missing!');
            throw new InternalServerErrorException('AI Service configuration missing. Please set GEMINI_API_KEY.');
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
            console.error('[AiService] Content generation failed:', error.message);
            throw new InternalServerErrorException(`AI Generation Failed: ${error.message}`);
        }
    }

    async generateJson(prompt: string): Promise<any> {
        const fullPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON. Do not include markdown formatting or extra text. If you must use markdown, ensure the JSON is clearly extractable.`;
        const text = await this.generateContent(fullPrompt);

        try {
            // More robust extraction of JSON from potential markdown/text wrapper
            const jsonMatch = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
            const cleanJson = jsonMatch ? jsonMatch[0] : text;

            try {
                return JSON.parse(cleanJson);
            } catch (innerError) {
                // Try one more time by stripping markdown backticks if any
                const stripped = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(stripped);
            }
        } catch (error) {
            console.error('[AiService] JSON Parsing failed. Response text snippet:', text.substring(0, 100));
            console.error('[AiService] Error details:', error.message);
            throw new InternalServerErrorException('AI returned invalid data format');
        }
    }

    async analyzeMaterial(content: string) {
        console.log('[AiService] Analyzing material of length:', content?.length);
        const prompt = `Act as an expert academic tutor. Analyze the following study material and extract the core concepts and subtopics.
    Return a JSON array of objects: [{ "topic": "Name", "description": "Desc", "difficulty": "EASY" | "MEDIUM" | "HARD" }]
    Content: ${content.substring(0, 20000)}`; // Increased limit slightly
        return this.generateJson(prompt);
    }

    async generateQuestions(content: string, count: number = 10, masteryLevel: number = 50) {
        const prompt = `Act as a prestigious university professor. Generate ${count} diverse exam questions. 
    Mastery Level targeted: ${masteryLevel}%.
    
    CRITICAL: Provide a mix of:
    - 40% MCQs (Multiple Choice)
    - 30% SHORT answers (Conceptual explanations)
    - 30% LONG answers (Deep analysis and writing tasks)
    
    Return as JSON array: [{ "type": "MCQ" | "SHORT" | "LONG", "questionText": "...", "difficulty": "...", "options": ["opt1", "opt2"...], "correctAnswer": "...", "explanation": "...", "subTopic": "..." }]
    
    Content: ${content.substring(0, 20000)}`;
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
