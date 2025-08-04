import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { User } from '../../domain/entities/user';
import { UserId } from '../../domain/value-objects/user-id';
import { handlePrismaError } from '../exception/prismaException';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaProvider) {}

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
      if (error instanceof PrismaClientKnownRequestError) {
        handlePrismaError(error);
      }
      console.error(`DataBase Error: ${error}`);
      throw new InternalServerErrorException('DataBase Error');
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
      if (error instanceof PrismaClientKnownRequestError) {
        handlePrismaError(error);
      }
      throw new InternalServerErrorException();
    }
  }
}
