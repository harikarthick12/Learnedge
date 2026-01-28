import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) { }

  @Get('api/welcome')
  getHello(): string {
    return 'LearnEdge API is active!';
  }

  @Get('api/health')
  async checkHealth() {
    const status: any = {
      timestamp: new Date().toISOString(),
      database: 'UNKNOWN',
      ai: 'UNKNOWN',
    };

    try {
      await this.prisma.user.count();
      status.database = 'OK';
    } catch (e) {
      status.database = `ERROR: ${e.message}`;
    }

    try {
      // Smallest possible AI call
      await this.ai.generateContent('ping');
      status.ai = 'OK';
    } catch (e) {
      status.ai = `ERROR: ${e.message}`;
    }

    return status;
  }
}
