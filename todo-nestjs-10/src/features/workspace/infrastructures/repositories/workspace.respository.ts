import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { WorkspaceRole } from '@prisma/client';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { Workspace } from '@/features/workspace/domain/entities/workspace';
import { IWorkspaceRespitory } from '@/features/workspace/domain/repositories/workspace-repository.interface';
import { handlePrismaError } from '@/shared/base-class/exception/prismaException';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Injectable()
export class WorkspaceRespository implements IWorkspaceRespitory {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(WorkspaceRespository.name);
  }

  public async create(workspace: Workspace): Promise<void> {
    try {
      await this.prisma.tx.workspaceModel.create({
        data: {
          id: workspace.id,
          name: workspace.name,
          workspaceClassification: workspace.workspaceClassification,
          description: workspace.description,
          createById: workspace.createById,
          updateAt: new Date(),
          createAt: new Date(),
          groups: {
            create: workspace.groupWorkspaceAccess.map((value) => ({
              role: WorkspaceRole[value.workspaceRole as keyof typeof WorkspaceRole],
              group: {
                connect: { id: value.groupId },
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
