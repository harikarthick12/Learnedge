import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Post('generate/:materialId')
    async generate(@Param('materialId') materialId: string) {
        return this.quizService.generateQuestions(materialId, 'guest-user');
    }

    @Post('submit/:questionId')
    async submit(
        @Param('questionId') questionId: string,
        @Body('answer') answer: string,
    ) {
        return this.quizService.submitAnswer('guest-user', questionId, answer);
    }

    @Get('performance')
    async getPerformance() {
        return this.quizService.getPerformance('guest-user');
    }
}
