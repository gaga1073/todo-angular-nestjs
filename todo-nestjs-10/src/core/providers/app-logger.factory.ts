import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { AppLogger } from '../utils/app-logger.util';

// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class AppLoggerFactory {
  constructor(
    private readonly clsService: ClsService,
    private readonly configService: ConfigService,
  ) {}

  create(className: string): AppLogger {
    const requestId = this.clsService.get<string>('requestId');
    return new AppLogger(className, requestId, this.configService);
  }
}
