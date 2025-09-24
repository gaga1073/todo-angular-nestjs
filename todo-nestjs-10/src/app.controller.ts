import { Controller, Get, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AppService } from './app.service';
import { AppLoggerFactory } from './core/providers/app-logger.factory';
import { AppLogger } from './core/utils/app-logger.util';

@Controller()
export class AppController {
  private appLogger: AppLogger;
  constructor(
    private readonly appService: AppService,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(AppController.name);
  }

  // logger = new AppLogger(AppController.name);
  // logger = new AppLogger(AppController.name);

  @Get('/')
  // @UseGuards(JwtAuthGuard)
  async hello(@Req() req: FastifyRequest): Promise<string> {
    console.info((req as FastifyRequest & { user: string })?.user);
    this.appLogger.info('ロガー');

    return 'Hello';
  }
}
