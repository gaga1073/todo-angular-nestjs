import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { UserModel } from '@prisma/client';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { User } from '@/features/user/domain/entities/user';
import { IUserRepository } from '@/features/user/domain/repositories/user-repository.interface';
import { handlePrismaError } from '@/shared/base-class/exception/prismaException';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserRepository.name);
  }

  public async create(user: User): Promise<void> {
    try {
      await this.prisma.tx.userModel.create({
        data: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isDelete: false,
          password: user.password,
          updateAt: new Date(),
          createAt: new Date(),
        },
      });
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.create.name });
      return handlePrismaError(error);
    }
  }

  public async findActiveUserByEmail(email: string): Promise<UserModel | null> {
    try {
      const row = await this.prisma.tx.userModel.findFirst({
        where: {
          email: email,
        },
      });

      return row;
    } catch (error) {
      return handlePrismaError(error);
    }
  }
}
