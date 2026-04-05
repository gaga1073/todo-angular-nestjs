import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { GetGroupsByUserIdResponse } from '@/features/group/dto/response/get-group-by-user-id.response';
import { PostUserSearchRequest } from '@/features/user/dto/request/post-user-search.request';
import { GetUserResponse } from '@/features/user/dto/response/get-user.response';
import { GetUsersResponse } from '@/features/user/dto/response/get-users.response';
import { PostUserSearchResponse } from '@/features/user/dto/response/post-user-search.response';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';
import { GroupClassificationType } from '@/shared/constants/management.constant';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class UserQueryService {
  private appLogger: AppLogger;

  constructor(
    private readonly prisma: PrismaProvider,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserRepository.name);
  }

  public async getUserForJwtValidation(id: string): Promise<UserDto | null> {
    try {
      const user = await this.prisma.userModel.findUnique({
        where: { id: id, isDeleted: false, isActive: true },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.getUserForJwtValidation.name });
      return handlePrismaError(error);
    }
  }

  public async findUsers(loginUser: UserDto): Promise<GetUsersResponse[]> {
    try {
      const rows = await this.prisma.userModel.findMany({
        where: {
          id: loginUser.role === 'general' ? loginUser.id : undefined,
          isDeleted: false,
        },
      });

      return rows.map((row) => plainToInstance(GetUsersResponse, row));
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }

  public async findUser(id: string, loginUser: UserDto): Promise<GetUserResponse> {
    try {
      if (loginUser.role === 'general' && id !== loginUser.id) {
        throw new ForbiddenException('権限エラー');
      }
      const user = await this.prisma.userModel.findUniqueOrThrow({
        where: {
          id: id,
          isDeleted: false,
        },
      });

      return plainToInstance(GetUserResponse, user);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }

  public async findUsersByGroupId(
    groupId: string,
    loginUser: UserDto,
  ): Promise<GetGroupsByUserIdResponse[]> {
    try {
      const rows = await this.prisma.userModel.findMany({
        where: {
          id: loginUser.role === 'general' ? loginUser.id : undefined,
          isDeleted: false,
          groups: {
            some: {
              groupId: groupId,
            },
          },
        },
      });

      return rows.map((row) => plainToInstance(GetGroupsByUserIdResponse, row));
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsersByGroupId.name });
      return handlePrismaError(error);
    }
  }

  public async findSearch(
    loginUser: UserDto,
    postUserSearchRequest: PostUserSearchRequest,
    groupClassification?: GroupClassificationType,
    pagination?: {
      page: number;
      pageSize: number;
    },
  ): Promise<PostUserSearchResponse> {
    try {
      const { name, role, isActive } = postUserSearchRequest;

      let skipAndTake;

      if (pagination !== undefined) {
        skipAndTake = {
          skip: pagination.pageSize * (pagination.page - 1),
          take: pagination.pageSize,
        };
      }

      const where: Prisma.UserModelWhereInput = {
        id: loginUser.role === 'general' ? loginUser.id : undefined,
        ...(name
          ? {
              OR: [{ name: { contains: name } }, { email: { contains: name } }],
            }
          : undefined),
        role: role,
        isActive: isActive,
        isDeleted: false,
      };

      const rows = await this.prisma.userModel.findMany({
        where: where,
        orderBy: { id: 'asc' },
        ...skipAndTake,
        include: {
          groups: {
            where: {
              group: {
                groupClassification: groupClassification,
              },
            },
            include: {
              group: true,
            },
          },
        },
      });

      const totalRowCount = await this.prisma.userModel.count({
        where: where,
      });

      const users = rows.map((row) => ({
        ...row,
        groups: row.groups.map((value) => value.group),
      }));

      return plainToInstance(PostUserSearchResponse, {
        items: users,
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
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }

  public async findByProjectId(projectId: string, loginUser: UserDto): Promise<GetUsersResponse[]> {
    try {
      const row = await this.prisma.userModel.findMany({
        where: {
          id: loginUser.role === 'general' ? loginUser.id : undefined,
          isDeleted: false,
          groups: {
            some: {
              group: {
                projects: {
                  some: {
                    id: projectId,
                  },
                },
              },
            },
          },
        },
      });

      return row.map((row) => plainToInstance(GetUsersResponse, row));
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }
}
