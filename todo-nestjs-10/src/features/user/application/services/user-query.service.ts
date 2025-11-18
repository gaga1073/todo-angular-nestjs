import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { handlePrismaError } from '@/shared/utils/prismaException.util';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';

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
