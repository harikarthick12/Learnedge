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
            // Using gemini-flash-latest for better availability
            this.model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
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
        console.log('[AiService] Analyzing material for structure and concepts');
        const prompt = `Act as an expert academic tutor. Analyze the following study material.
    1. Extract core concepts and subtopics with difficulty levels.
    2. Create a hierarchical "Concept Graph" (mind map structure).
    
    Return JSON: 
    {
      "topics": [{ "topic": "Name", "description": "Desc", "difficulty": "EASY" | "MEDIUM" | "HARD" }],
      "conceptGraph": { "name": "Main Topic", "children": [{ "name": "Subtopic", "children": [...] }] }
    }
    
    Content: ${content.substring(0, 20000)}`;
        return this.generateJson(prompt);
    }

    async generateStudyPlan(content: string, dailyMinutes: number, syllabusSize: string) {
        const prompt = `Generate a daily AI study plan based on this material content.
    Syllabus Size: ${syllabusSize}
    Available daily time: ${dailyMinutes} minutes.
    
    Return a JSON array of daily tasks:
    [{ "day": 1, "tasks": [{ "topic": "...", "duration": "... min", "goal": "..." }] }]
    
    Content summary: ${content.substring(0, 5000)}`;
        return this.generateJson(prompt);
    }

    async explainInStyle(content: string, style: 'CHILD' | 'EXAM' | 'CODE' | 'ANALOGY') {
        const stylePrompts = {
            'CHILD': "Explain this like I'm 10 years old. Use very simple language and relatable examples.",
            'EXAM': "Explain this for a high-stakes exam. Focus on key definitions, technical terms, and potential exam points.",
            'CODE': "Explain this with practical code examples (if applicable) or a step-by-step logical algorithm.",
            'ANALOGY': "Explain this using a powerful, creative analogy that makes the concept unforgettable."
        };

        const prompt = `${stylePrompts[style]}\n\nContent: ${content}`;
        return this.generateContent(prompt);
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
        const prompt = `Evaluate the student's answer critically. 
    Compare the student's answer with the ideal answer.
    
    Return JSON: { 
      "score": 0-100, 
      "isCorrect": boolean, 
      "feedback": "Overall feedback",
      "mistakeAnalysis": {
        "whatWasWrong": "Specifically what the student got wrong or misinterpreted",
        "missingPoints": ["Point 1 that was missing", "Point 2..."],
        "improvementTips": "Practical advice to improve"
      },
      "explanation": "Detailed explanation of the concept", 
      "analogy": "A helpful analogy", 
      "memoryTrick": "A mnemonic or trick", 
      "realWorldExample": "..." 
    }
    
    Context: ${context.substring(0, 5000)}
    Question: ${question}
    Student: ${studentAnswer}
    Ideal: ${idealAnswer}`;
        return this.generateJson(prompt);
    }
}
