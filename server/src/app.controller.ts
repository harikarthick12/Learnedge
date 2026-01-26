import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly ai: AiService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
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
