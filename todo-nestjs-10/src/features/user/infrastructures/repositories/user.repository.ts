import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
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
        updateAt: row.updateAt,
      });

      return {
        user: entity,
        version: row.version,
      };
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.restoreAggregate.name,
      });
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
          createAt: user.createAt,
          updateAt: user.updateAt,
        },
      });
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.create.name,
      });
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
      this.appLogger.error('データベースエラーが発生しました。', error, { method: this.save.name });
      return handlePrismaError(error);
    }
  }

  public async existsActiveGroupByName(email: string): Promise<boolean> {
    try {
      const row = await this.prisma.tx.userModel.findFirst({
        where: {
          email: email,
        },
      });

      return row !== null;
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.existsActiveGroupByName.name,
      });
      return handlePrismaError(error);
    }
  }

  public async existsDeletedUser(userId: UserId): Promise<boolean> {
    try {
      const row = await this.prisma.tx.userModel.findUniqueOrThrow({
        where: {
          id: userId,
        },
      });

      return row !== null;
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.existsDeletedUser.name,
      });
      return handlePrismaError(error);
    }
  }
}
