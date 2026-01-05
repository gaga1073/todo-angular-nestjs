import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
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
        where: { id: id },
      });

      return plainToInstance(UserDto, user);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.getUserForJwtValidation.name });
      return handlePrismaError(error);
    }
  }

  public async findUsers(
    loginUser: UserDto,
    groupClassification?: GroupClassificationType,
  ): Promise<GetUsersResponse> {
    try {
      const rows = await this.prisma.userModel.findMany({
        where: {
          id: loginUser.role === 'general' ? loginUser.id : undefined,
        },
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

      const users = rows.map((row) => ({
        ...row,
        groups: row.groups.map((value) => value.group),
      }));

      return plainToInstance(GetUsersResponse, { users: users });
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }

  public async findUser(id: string, loginUser: UserDto): Promise<GetUserResponse> {
    try {
      if (loginUser.role === 'general') {
      }
      const user = await this.prisma.userModel.findUniqueOrThrow({
        where: {
          id: id,
        },
      });

      return plainToInstance(GetUserResponse, user);
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findUsers.name });
      return handlePrismaError(error);
    }
  }

  public async findSearch(
    loginUser: UserDto,
    postUserSearchRequest: PostUserSearchRequest,
    groupClassification?: GroupClassificationType,
    pagenation?: {
      page: number;
      pageSize: number;
    },
  ): Promise<PostUserSearchResponse> {
    try {
      const { name, role, isActive } = postUserSearchRequest;

      let skipAndTake;

      if (pagenation !== undefined) {
        skipAndTake = {
          skip: pagenation.pageSize * (pagenation.page - 1),
          take: pagenation.pageSize,
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
        users: users,
        ...(pagenation !== undefined
          ? {
              pagenation: {
                currentPage: pagenation.page,
                pageSize: pagenation.pageSize,
                totalPages: Math.ceil(totalRowCount / pagenation.pageSize),
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
}
