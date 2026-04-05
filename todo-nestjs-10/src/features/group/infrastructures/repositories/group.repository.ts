import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Group } from '@/features/group/domain/entities/group';
import { IGroupRepository } from '@/features/group/domain/repositories/group-repository.interface';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class GroupRepository implements IGroupRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(GroupRepository.name);
  }

  public async restoreAggregate(groupId: string): Promise<{ group: Group; version: number }> {
    try {
      const row = await this.prisma.tx.groupModel.findUniqueOrThrow({
        where: {
          id: groupId,
        },
        include: {
          users: {
            where: {
              user: {
                isDeleted: false,
              },
            },
          },
        },
      });

      const entity = Group.restore({
        id: row.id,
        name: row.name,
        description: row.description,
        groupClassification: row.groupClassification,
        isDeleted: row.isDeleted,
        updateAt: row.updateAt,
        createAt: row.createAt,
        groupMembers: row.users.map((user) => user.userId),
      });

      return { group: entity, version: row.version };
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.restoreAggregate.name,
      });
      return handlePrismaError(error);
    }
  }

  public async create(group: Group): Promise<void> {
    try {
      await this.prisma.tx.groupModel.create({
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          groupClassification: group.groupClassification,
          isDeleted: group.isDeleted,
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
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.create.name,
      });
      return handlePrismaError(error);
    }
  }

  private excludeAddedMembers(currentMembers: string[], updateMembers: string[]): string[] {
    return updateMembers.filter((updateMember) => {
      return !currentMembers.some((currentMember) => currentMember === updateMember);
    });
  }

  private excludeDeletedMembers(currentMembers: string[], updateMembers: string[]): string[] {
    return currentMembers.filter((currentMember) => {
      return !updateMembers.some((updateMember) => currentMember === updateMember);
    });
  }

  public async save(group: Group, version: number): Promise<void> {
    try {
      const currentMembers = await this.prisma.tx.userModel
        .findMany({
          where: {
            groups: {
              some: {
                groupId: group.id,
              },
            },
          },
          select: {
            id: true,
          },
        })
        .then((rows) => rows.map((row) => row.id));

      const excludeAddedMembers = this.excludeAddedMembers(currentMembers, group.groupMembers);
      const excludeDeletedGroupMembers = this.excludeDeletedMembers(
        currentMembers,
        group.groupMembers,
      );

      await this.prisma.tx.groupModel.update({
        where: {
          id: group.id,
          version: version,
        },
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          groupClassification: group.groupClassification,
          isDeleted: group.isDeleted,
          updateAt: group.updateAt,
          createAt: group.createAt,
          version: ++version,
          users: {
            create: excludeAddedMembers?.map((groupMember) => ({
              user: {
                connect: { id: groupMember },
              },
            })),
            deleteMany: excludeDeletedGroupMembers?.map((groupMember) => ({
              userId: groupMember,
            })),
          },
        },
      });
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, { method: this.save.name });
      return handlePrismaError(error);
    }
  }

  public async existsDeletedGroup(groupId: string): Promise<boolean> {
    try {
      const row = await this.prisma.tx.groupModel.findUniqueOrThrow({
        where: {
          id: groupId,
        },
      });

      return row.isDeleted;
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.existsDeletedGroup.name,
      });
      return handlePrismaError(error);
    }
  }

  public async retrievePrivateGroupIdByUserId(userId: string): Promise<string> {
    try {
      const rows = await this.prisma.tx.groupModel.findMany({
        where: {
          groupClassification: 'private',
          users: {
            some: {
              user: {
                id: userId,
              },
            },
          },
        },
      });

      if (rows.length !== 1) {
        throw new InternalServerErrorException('データが不整合です');
      }

      return rows[0].id;
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.retrievePrivateGroupIdByUserId.name,
      });
      return handlePrismaError(error);
    }
  }

  public async existsActiveGroupByName(name: string): Promise<boolean> {
    try {
      const row = await this.prisma.tx.groupModel.findFirst({
        where: {
          name: name,
          isDeleted: false,
        },
      });

      return !!row;
    } catch (error) {
      this.appLogger.error('DataBase Error ocoured', error, {
        method: this.existsActiveGroupByName.name,
      });
      return handlePrismaError(error);
    }
  }
}
