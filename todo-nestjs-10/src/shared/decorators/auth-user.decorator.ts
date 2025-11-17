import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from '@/features/user/domain/entities/user';

export const AuthUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest & { user: User }>();
  // LocalStrategy.validateの戻り値のuserがrequestのプロパティに登録されている
  return request.user;
});
