import { User } from '@/user-management/domain/entities/user';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  create(user: User): Promise<void>;
}
