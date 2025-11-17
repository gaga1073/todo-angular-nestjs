import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';
import { handlePrismaError } from '@/shared/base-class/exception/prismaException';
import { AppLogger } from '@/shared/utils/app-logger.util';

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
}
