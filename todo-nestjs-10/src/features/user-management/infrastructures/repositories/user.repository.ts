import { Injectable } from '@nestjs/common';
import { handlePrismaError } from '@/core/base-class/exception/prismaException';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { AppLogger } from '@/core/utils/app-logger.util';
import { User } from '@/user-management/domain/entities/user';

@Injectable()
export class UserRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: PrismaProvider,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserRepository.name);
  }

  public async create(user: User): Promise<void> {
    try {
      await this.prisma.userModel.create({
        data: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: 'member',
          isDelete: false,
          password: user.password,
          updateAt: new Date(),
          createAt: new Date(),
        },
      });
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.create.name });
      handlePrismaError(error);
    }
  }
}
