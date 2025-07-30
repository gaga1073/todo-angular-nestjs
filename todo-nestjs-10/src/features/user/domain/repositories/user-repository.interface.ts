import { User } from '../entities/user';

export const IUserRepositoryToken = Symbol('IUserRepository');

export interface IUserRepository {
  findOneByEmail(username: string): Promise<User | null>;
}
