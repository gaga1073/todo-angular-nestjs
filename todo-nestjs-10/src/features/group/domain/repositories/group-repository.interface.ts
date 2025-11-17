import { Group } from '@/features/group/domain/entities/group';

export const IGroupRepositoryToken = Symbol('IGroupRepository');

export interface IGroupRepository {
  create(group: Group): Promise<void>;
}
