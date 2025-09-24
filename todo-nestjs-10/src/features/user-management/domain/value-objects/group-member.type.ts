import { Ulid } from '@/core/base-class/domain/ulid';
import { GroupRole } from '@/user-management/domain/value-objects/group-role.type';

export type GroupMember = {
  readonly userId: Ulid;
  role: GroupRole;
};
