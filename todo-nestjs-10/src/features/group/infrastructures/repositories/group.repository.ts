import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { Group } from '@/features/group/domain/entities/group';
import { IGroupRepository } from '@/features/group/domain/repositories/group-repository.interface';
import { handlePrismaError } from '@/shared/utils/prismaException.util';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Injectable()
export class GroupRepository implements IGroupRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(GroupRepository.name);
  }

  public async create(group: Group): Promise<void> {
    try {
      await this.prisma.tx.groupModel.create({
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          groupClassification: group.groupClassification,
          updateAt: new Date(),
          createAt: new Date(),
          users: {
            create: group.groupMembers?.map((groupMember) => ({
              user: {
                connect: { id: groupMember },
              },
            })),
          },
        },
      });
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.create.name });
      return handlePrismaError(error);
    }
  }
}
