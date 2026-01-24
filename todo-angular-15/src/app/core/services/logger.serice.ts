import { inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@/core/token/environment.token';

type LogLevel = 'INFO' | 'ERROR' | 'DEBIG';

@Injectable()
export class LoggerService {
  environment = inject<Environment>(ENVIRONMENT);
  info(message: string, meta: unknown) {
    this.log('INFO', message, meta);
  }

  private log(level: LogLevel, message: string, meta: unknown) {
    const payload = {
      level,
      message,
      meta,
    };

    if (!this.environment.production) {
      switch (level) {
        case 'INFO':
          console.info(payload);
          break;
        case 'ERROR':
          console.error(payload);
          break;
        case 'DEBIG':
          console.debug(payload);
          break;
      }
    } else {
      // TODO: call logger api
    }
  }
}
