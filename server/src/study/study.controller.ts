import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StudyService } from './study.service';

@Controller('study')
@UseGuards(JwtAuthGuard)
export class StudyController {
    constructor(private readonly studyService: StudyService) { }

    @Post('plan')
    async createPlan(
        @Request() req: any,
        @Body() body: { materialId: string; dailyMinutes: number; syllabusSize: string }
    ) {
        return this.studyService.createStudyPlan(
            req.user.userId,
            body.materialId,
            body.dailyMinutes,
            body.syllabusSize
        );
    }

    @Get('plans')
    async getPlans(@Request() req: any) {
        return this.studyService.getPlans(req.user.userId);
    }

    @Get('metrics')
    async getMetrics(@Request() req: any) {
        return this.studyService.getConfidenceMetrics(req.user.userId);
    }
}
