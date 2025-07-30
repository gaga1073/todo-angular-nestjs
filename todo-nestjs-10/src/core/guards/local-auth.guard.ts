import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { FastifyRequest } from 'fastify';
import { firstValueFrom, isObservable } from 'rxjs';
import { LoginRequest } from 'src/features/auth/dto/login.request';
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const loginRequest = plainToInstance(LoginRequest, request.body);

    try {
      await validateOrReject(loginRequest);
    } catch (error) {
      if (Array.isArray(error)) {
        throw new BadRequestException(
          error.flatMap((eachError) => Object.values(eachError.constraints)),
        );
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }

    const result = await super.canActivate(context);

    if (result instanceof Promise) {
      return await result;
    }
    if (isObservable(result)) {
      return await firstValueFrom(result);
    }
    return result;
  }
}
