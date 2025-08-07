import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapter: AbstractHttpAdapter) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception.getStatus();

    const body = { status: status, message: exception.message };

    this.httpAdapter.reply(response, body, status);
  }
}
