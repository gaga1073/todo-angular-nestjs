import { Group } from '@/features/group/domain/entities/group';

export const IGroupRepositoryToken = Symbol('IGroupRepository');

export interface IGroupRepository {
  restoreAggregate(groupId: string): Promise<{ group: Group; version: number }>;
  create(group: Group): Promise<void>;
  save(group: Group, version: number): Promise<void>;
  existsDeletedGroup(groupId: string): Promise<boolean>;
  retrievePrivateGroupIdByUserId(userId: string): Promise<string>;
  existsActiveGroupByName(name: string): Promise<boolean>;
}
