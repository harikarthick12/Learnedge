import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuizService } from './quiz.service';

@Controller('quiz')
@UseGuards(JwtAuthGuard)
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Post('generate/:materialId')
    async generate(@Param('materialId') materialId: string, @Request() req) {
        return this.quizService.generateQuestions(materialId, req.user.userId);
    }

    @Post('submit/:questionId')
    async submit(
        @Param('questionId') questionId: string,
        @Body('answer') answer: string,
        @Request() req,
    ) {
        return this.quizService.submitAnswer(req.user.userId, questionId, answer);
    }

    @Get('performance')
    async getPerformance(@Request() req) {
        return this.quizService.getPerformance(req.user.userId);
    }
}
