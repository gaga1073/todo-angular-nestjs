import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, LoggerOptions, transports } from 'winston';
import { ConsoleTransportOptions } from 'winston/lib/winston/transports';
import { toISOStringWithTimezone } from './common.util';

export class AppLogger {
  private logger: Logger;

  constructor(
    private readonly className: string,
    private readonly requestId: string,
    private readonly configService: ConfigService,
  ) {
    const winstonConfig: LoggerOptions = {
      level: 'info',
      defaultMeta: { requestId: this.requestId },
      format: format.combine(
        format.timestamp({
          format: () => toISOStringWithTimezone(new Date()),
        }),
        format.printf(({ timestamp, level, message, meta, requestId }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            requestId,
            meta,
          });
        }),
      ),
      transports: [
        new transports.File({
          filename: `${this.configService.get<string>('LOG_DIRECTORY_PATH')}/app.log`,
          level: 'info',
        }),
      ],
    };

    const winstonConsoleConfig: ConsoleTransportOptions = {
      level: 'debug',
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: () => toISOStringWithTimezone(new Date()),
        }),
        format.printf(({ timestamp, level, message, meta, error, requestId }) => {
          return `[${timestamp}] ${level} ${message} ${JSON.stringify({ requestId, meta })}\n${error}`;
        }),
      ),
    };

    const logger = createLogger(winstonConfig);

    if (process.env.NODE_ENV !== 'production') {
      logger.add(new transports.Console(winstonConsoleConfig));
    }

    this.logger = logger;
  }

  info(message: string, meta?: { method: string }): void {
    this.logger.info(message, {
      meta: { class: this.className, method: meta?.method },
    });
  }

  error(message: string, error: unknown, meta?: { method: string }): void {
    this.logger.error(message, {
      error,
      meta: { class: this.className, method: meta?.method },
    });
  }

  debug(message: string, meta?: { method: string }): void {
    this.logger.debug(message, {
      meta: { class: this.className, method: meta?.method },
    });
  }
}
