import { Injectable } from '@nestjs/common';
import { handlePrismaError } from '@/core/base-class/exception/prismaException';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { AppLogger } from '@/core/utils/app-logger.util';
import { UserDto } from '@/user-management/dto/user.dto';
import { UserRepository } from '@/user-management/infrastructures/repositories/user.repository';

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

      return user;
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.getUserForJwtValidation.name });
      return handlePrismaError(error);
    }
  }
}
