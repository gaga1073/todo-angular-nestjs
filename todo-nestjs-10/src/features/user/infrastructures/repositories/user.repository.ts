import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { AppLogger } from 'src/core/utils/logger.util';
import { User } from '../../domain/entities/user';
import { UserId } from '../../domain/value-objects/user-id';
import { handlePrismaError } from '../exception/prismaException';

@Injectable()
export class UserRepository {
  private readonly logger: AppLogger;

  constructor(private readonly prisma: PrismaProvider) {
    this.logger = new AppLogger(UserRepository.name);
  }

  public async findOneByEmail(email: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (row === null) {
        return null;
      }

      const user = User.restore({
        id: new UserId(row.id),
        email: row.email,
        username: row.name,
        password: row.password,
      });

      return user;
    } catch (error) {
      this.logger.error('DataBase Error occured', error);
      return handlePrismaError(error);
    }
  }

  public async findOneById(id: string): Promise<User | null> {
    try {
      const row = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });

      if (!row) {
        return null;
      }

      const user = User.restore({
        id: new UserId(row.id),
        email: row.email,
        username: row.name,
        password: row.password,
      });

      return user;
    } catch (error) {
      this.logger.error('DataBase Error occured', error);
      return handlePrismaError(error);
    }
  }

  public async create(user: User): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          password: user.password,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('DataBase Error occured', error);
      }
      handlePrismaError(error);
    }
  }
}
