import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { UserModel } from '@prisma/client';
import { User } from '@/features/user/domain/entities/user';
import { IUserRepository } from '@/features/user/domain/repositories/user-repository.interface';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserRepository.name);
  }

  public async restoreAggregate(userId: string): Promise<{ user: User; version: number }> {
    try {
      const row = await this.prisma.tx.userModel.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      const entity = User.restore({
        id: row.id,
        email: row.email,
        name: row.name,
        password: row.password,
        role: row.role,
        isDeleted: row.isDeleted,
        isActive: row.isActive,
        createAt: row.createAt,
      });

      return {
        user: entity,
        version: row.version,
      };
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.restoreAggregate.name });
      return handlePrismaError(error);
    }
  }

  public async create(user: User): Promise<void> {
    try {
      await this.prisma.tx.userModel.create({
        data: {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          isDeleted: user.isDeleted,
          isActive: user.isActive,
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

  public async save(user: User, version: number): Promise<void> {
    try {
      await this.prisma.tx.userModel.update({
        where: {
          id: user.id,
          version: version,
        },
        data: {
          email: user.email,
          name: user.name,
          role: user.role,
          isDeleted: user.isDeleted,
          isActive: user.isActive,
          password: user.password,
          updateAt: new Date(),
          version: ++version,
        },
      });
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.save.name });
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
      this.appLogger.error('DataBase Error occured', error, {
        method: this.findActiveUserByEmail.name,
      });
      return handlePrismaError(error);
    }
  }

  public async findById(userId: UserId): Promise<UserModel> {
    try {
      const row = await this.prisma.tx.userModel.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return row;
    } catch (error) {
      this.appLogger.error('DataBase Error occured', error, { method: this.findById.name });
      return handlePrismaError(error);
    }
  }
}
