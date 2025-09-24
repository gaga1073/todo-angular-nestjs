import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateOrReject, ValidationError } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { firstValueFrom, isObservable } from 'rxjs';
import { LoginRequest } from '@/auth/dto/login.request';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { AppLogger } from '@/core/utils/app-logger.util';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  private readonly logger: AppLogger;
  constructor(private readonly appLoggerFactory: AppLoggerFactory) {
    super();
    this.logger = this.appLoggerFactory.create(LocalAuthGuard.name);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const loginRequest = plainToInstance(LoginRequest, request.body);

    try {
      await validateOrReject(loginRequest);
    } catch (error) {
      if (Array.isArray(error) && error.every((e) => e instanceof ValidationError)) {
        const messages = error.flatMap((eachError) =>
          Object.values(eachError.constraints ? eachError.constraints : ''),
        );

        const validationError = new Error(messages.join(', '));

        this.logger.error('Validation error occurred.', validationError, {
          method: this.canActivate.name,
        });
        throw new BadRequestException('Validation error occurred.');
      }
      this.logger.error('An unexpected error occurred.', error, {
        method: this.canActivate.name,
      });
      throw new InternalServerErrorException('An unexpected error occurred.');
    }

    const result = await super.canActivate(context);

    if (typeof result === 'boolean') {
      return result;
    }
    if (isObservable(result)) {
      return await firstValueFrom(result);
    }
    return result;
  }
}
