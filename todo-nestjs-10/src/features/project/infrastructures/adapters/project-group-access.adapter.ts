import { Injectable } from '@nestjs/common';
import { IProjectGroupAccessPort } from '@/features/project/domain/ports/project-group-access.port';
import { PrismaProvider } from '@/shared/providers/prisma.provider';

@Injectable()
export class ProjectGroupAccessAdapter implements IProjectGroupAccessPort {
  constructor(private readonly prisma: PrismaProvider) {}

  public async isMember(userId: string, groupId: string): Promise<boolean> {
    const row = await this.prisma.userGroupModel.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId,
        },
      },
    });

    return row !== null;
  }
}
