import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
  CustomDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { UserRoleType } from '@/shared/constants/management.constant';
import { User } from '@/features/user/domain/entities/user';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<FastifyRequest & { user: User }>();
    const user = request.user;
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(roles: string[], userRole: UserRoleType): boolean {
    let isMatched = false;

    for (const role of roles) {
      if (role === userRole) {
        isMatched = true;
      }
    }

    return isMatched;
  }
}

export const UserRole = (...roles: UserRoleType[]): CustomDecorator<string> =>
  SetMetadata('roles', roles);
