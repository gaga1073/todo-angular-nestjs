import { UserModel } from '@prisma/client';
import { User } from '@/features/user/domain/entities/user';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  create(user: User): Promise<void>;

  findActiveUserByEmail(email: string): Promise<UserModel | null>;
}
