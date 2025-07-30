import { Injectable } from '@nestjs/common';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/user-repository.interface';
import { UserId } from '../../domain/value-objects/user-id';

@Injectable()
export class UserRepository implements IUserRepository {
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
      console.error(`DataBase Error: ${error}`);
      throw new Error('DataBase Error');
    }
  }
}
