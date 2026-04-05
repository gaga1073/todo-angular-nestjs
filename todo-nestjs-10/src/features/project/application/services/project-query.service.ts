import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '@/features/auth/dto/login.response';
import { PostProjectSearchRequest } from '@/features/project/dto/request/post-project-search.request';
import { getProjectResponse } from '@/features/project/dto/response/get-project.response';
import { getProjectsResponse } from '@/features/project/dto/response/get-projects.response';
import { PostProjectSearchResponse } from '@/features/project/dto/response/post-search-project.response';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class ProjectQueryService {
  appLogger: AppLogger;

  constructor(
    private readonly prisma: PrismaProvider,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(ProjectQueryService.name);
  }

  public async findProjects(loginUser: UserDto): Promise<getProjectsResponse[]> {
    try {
      const rows = await this.prisma.projectModel.findMany({
        where: {
          isDeleted: false,
          group: {
            users: {
              some: {
                userId: loginUser.id,
              },
            },
          },
        },
      });

      return rows.map((row) => plainToInstance(getProjectsResponse, row));
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findProjects.name });
      return handlePrismaError(error);
    }
  }

  public async findProjectById(projectId: string, loginUser: UserDto): Promise<getProjectResponse> {
    try {
      const row = await this.prisma.projectModel.findUniqueOrThrow({
        where: {
          id: projectId,
          isDeleted: false,
          group: {
            users: {
              some: {
                userId: loginUser.id,
              },
            },
          },
        },
      });

      return plainToInstance(getProjectResponse, row);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findProjectById.name });
      return handlePrismaError(error);
    }
  }

  public async findSearch(
    loginUser: UserDto,
    request: PostProjectSearchRequest,
    pagination?: { page: number; pageSize: number },
  ): Promise<PostProjectSearchResponse> {
    try {
      const { name } = request;

      let skipAndTake;

      if (pagination !== undefined) {
        skipAndTake = {
          skip: pagination.pageSize * (pagination.page - 1),
          take: pagination.pageSize,
        };
      }

      const where: Prisma.ProjectModelWhereInput = {
        group: {
          users: {
            some: {
              userId: loginUser.id,
            },
          },
        },
        ...(name ? { name: { contains: name } } : undefined),
        isDeleted: false,
      };

      const rows = await this.prisma.projectModel.findMany({
        where: where,
        include: {
          group: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        ...skipAndTake,
      });

      const totalRowCount = await this.prisma.projectModel.count({
        where: where,
      });

      return plainToInstance(PostProjectSearchResponse, {
        items: rows.map((row) => ({
          ...row,
          group: { id: row.group.id, name: row.group.name },
        })),
        ...(pagination !== undefined
          ? {
              pagination: {
                currentPage: pagination.page,
                pageSize: pagination.pageSize,
                totalPages: Math.ceil(totalRowCount / pagination.pageSize),
                totalItems: totalRowCount,
              },
            }
          : undefined),
      });
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findSearch.name });
      return handlePrismaError(error);
    }
  }
}
