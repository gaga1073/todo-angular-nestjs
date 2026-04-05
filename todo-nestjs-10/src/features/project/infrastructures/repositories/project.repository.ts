import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ProjectModel } from '@prisma/client';
import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { Project } from '@/features/project/domain/entities/project';
import { IProjectRepository } from '@/features/project/domain/repositories/project-repository.interface';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class ProjectRepository implements IProjectRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(ProjectRepository.name);
  }

  public async restoreAggregate(ProjectId: string): Promise<{ project: Project; version: number }> {
    try {
      const row = await this.prisma.tx.projectModel.findUniqueOrThrow({
        where: { id: ProjectId },
      });

      const entity = Project.restore({
        id: row.id,
        name: row.name,
        groupId: GroupId.create(row.groupId),
        description: row.description,
        createById: row.createById,
        updateAt: row.updateAt,
        createAt: row.createAt,
        isDeleted: row.isDeleted,
      });

      return { project: entity, version: row.version };
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.restoreAggregate.name,
      });
      return handlePrismaError(error);
    }
  }

  public async create(project: Project): Promise<void> {
    try {
      await this.prisma.tx.projectModel.create({
        data: {
          id: project.id,
          name: project.name,
          groupId: project.groupId,
          description: project.description,
          createById: project.createById,
          updateAt: new Date(),
          createAt: new Date(),
        },
      });
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.create.name,
      });
      return handlePrismaError(error);
    }
  }

  public async save(project: Project, version: number): Promise<void> {
    try {
      await this.prisma.tx.projectModel.update({
        where: {
          id: project.id,
          version: version,
        },
        data: {
          id: project.id,
          name: project.name,
          description: project.description,
          groupId: project.groupId,
          createById: project.createById,
          isDeleted: project.isDeleted,
          updateAt: project.updateAt,
          createAt: project.createAt,
          version: ++version,
        },
      });
    } catch (error) {
      this.appLogger.error('DataBase Error occurred', error, { method: this.save.name });
      return handlePrismaError(error);
    }
  }

  public async findPrivateByUserId(userId: string): Promise<ProjectModel> {
    try {
      const rows = await this.prisma.tx.projectModel.findMany({
        where: {
          group: {
            groupClassification: 'private',
            users: {
              some: {
                userId: userId,
              },
            },
          },
        },
      });

      if (rows.length !== 1) {
        throw new InternalServerErrorException('データが不整合です');
      }

      return rows[0];
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.findPrivateByUserId.name,
      });
      return handlePrismaError(error);
    }
  }
}
