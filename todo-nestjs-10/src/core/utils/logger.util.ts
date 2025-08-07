import { Logger } from '@nestjs/common';

export class AppLogger {
  private readonly logger: Logger;

  constructor(private readonly className: string) {
    this.logger = new Logger();
  }

  info(message: string, context?: { method: string }): void {
    this.logger.log({
      msg: message,
      context: { class: this.className, method: context?.method },
    });
  }

  error(message: string, error: Error, context?: { method: string }): void {
    this.logger.error({
      msg: message,
      err: error,
      context: { class: this.className, method: context?.method },
    });
  }

  debug(message: string, context?: { method: string }): void {
    this.logger.debug({
      msg: message,
      context: { class: this.className, method: context?.method },
    });
  }
}
