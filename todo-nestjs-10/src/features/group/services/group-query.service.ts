import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '@/features/auth/dto/login.response';
import { GetGroupsResponse } from '@/features/group//dto/response/get-groups.response';
import { PostGroupSearchRequest } from '@/features/group/dto/request/post-group-search.request';
import { GetGroupsByUserIdResponse } from '@/features/group/dto/response/get-group-by-user-id.response';
import { GetGroupResponse } from '@/features/group/dto/response/get-group.response';
import { PostGroupSearchResponse } from '@/features/group/dto/response/post-group-search.response';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';
import { GroupClassificationType } from '@/shared/constants/management.constant';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class GroupQueryService {
  private appLogger: AppLogger;

  constructor(
    private readonly prisma: PrismaProvider,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserRepository.name);
  }

  public async findGroups(loginUser: UserDto): Promise<GetGroupsResponse[]> {
    try {
      const row = await this.prisma.groupModel.findMany({
        where: {
          isDeleted: false,
          users: {
            some: {
              user: {
                id: loginUser.role === 'general' ? loginUser.id : undefined,
              },
            },
          },
        },
      });

      return row.map((row) => plainToInstance(GetGroupsResponse, row));
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findGroups.name });
      return handlePrismaError(error);
    }
  }

  public async findGroup(groupId: string, loginUser: UserDto): Promise<GetGroupResponse> {
    try {
      const row = await this.prisma.groupModel.findUniqueOrThrow({
        where: {
          id: groupId,
          isDeleted: false,
        },
        include: {
          users: {
            where: {
              user: {
                id: loginUser.role === 'general' ? loginUser.id : undefined,
                isDeleted: false,
              },
            },
          },
        },
      });

      return plainToInstance(GetGroupResponse, row);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findGroup.name });
      return handlePrismaError(error);
    }
  }

  public async findGroupsByUserId(
    userId: string,
    loginUser: UserDto,
    groupClassification?: GroupClassificationType,
  ): Promise<GetGroupsByUserIdResponse[]> {
    if (loginUser.id === 'general' && userId !== loginUser.id) {
      throw new ForbiddenException('権限エラー');
    }

    try {
      const rows = await this.prisma.groupModel.findMany({
        where: {
          users: {
            some: {
              user: {
                id: userId,
                isDeleted: false,
              },
            },
          },
          groupClassification: groupClassification,
          isDeleted: false,
        },
      });

      const response = rows.map((row) => plainToInstance(GetGroupsByUserIdResponse, row));

      return response;
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findGroupsByUserId.name });
      return handlePrismaError(error);
    }
  }

  public async findSearch(
    loginUser: UserDto,
    request: PostGroupSearchRequest,
    groupClassification?: GroupClassificationType,
    pagination?: { page: number; pageSize: number },
  ): Promise<PostGroupSearchResponse> {
    try {
      const { name } = request;

      let skipAndTake;

      if (pagination !== undefined) {
        skipAndTake = {
          skip: pagination.pageSize * (pagination.page - 1),
          take: pagination.pageSize,
        };
      }

      const userFilter = {
        users: {
          some: {
            user: {
              id: loginUser.role === 'general' ? loginUser.id : undefined,
            },
          },
        },
      };

      const where: Prisma.GroupModelWhereInput = {
        groupClassification: groupClassification,
        ...(loginUser.role === 'general' ? userFilter : {}),
        ...(name ? { name: { contains: name } } : undefined),
        isDeleted: false,
      };

      const rows = await this.prisma.groupModel.findMany({
        where: where,
        ...skipAndTake,
        include: {
          users: {
            include: {
              user: true,
            },
          },
        },
      });

      const totalRowCount = await this.prisma.groupModel.count({
        where: where,
      });

      const groups = rows.map((row) => ({
        ...row,
        users: row.users.map((value) => value.user),
      }));

      return plainToInstance(PostGroupSearchResponse, {
        items: groups,
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
