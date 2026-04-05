import {
  CanActivate,
  CustomDecorator,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { User } from '@/features/user/domain/entities/user';
import { PrismaProvider } from '@/shared/providers/prisma.provider';

@Injectable()
export class ProjectMembershipGuard implements CanActivate {
  constructor(private readonly prisma: PrismaProvider) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest & { user: User }>();

    const { projectId } = request.params as { projectId: string };

    if (!projectId) {
      throw new ForbiddenException('プロジェクトIDが指定されていません');
    }

    const project = await this.prisma.projectModel.findUnique({
      where: {
        id: projectId,
        group: {
          users: {
            some: {
              userId: request.user.id,
            },
          },
        },
      },
    });

    if (!project) {
      throw new ForbiddenException('プロジェクトへのアクセス権限がありません');
    }

    return true;
  }
}

export const RequireProjectMembership = (): CustomDecorator =>
  SetMetadata('requireProjectMembership', true);
