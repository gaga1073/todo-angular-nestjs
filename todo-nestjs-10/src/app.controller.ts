import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AppService } from './app.service';
import { JwtAuthGuard } from './core/guards/jwt-auth.guard';
import { AppLogger } from './core/utils/logger.util';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  logger = new AppLogger(AppController.name);

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async hello(@Req() req: FastifyRequest): Promise<string> {
    console.info((req as FastifyRequest & { user: string })?.user);
    this.logger.info('ロガー');
    return 'Hello';
  }
}
