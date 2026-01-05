import { UserModel } from '@prisma/client';
import { User } from '@/features/user/domain/entities/user';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  restoreAggregate(userId: string): Promise<{ user: User; version: number }>;

  create(user: User): Promise<void>;

  save(user: User, version: number): Promise<void>;

  findActiveUserByEmail(email: string): Promise<UserModel | null>;

  findById(userId: UserId): Promise<UserModel>;
}
