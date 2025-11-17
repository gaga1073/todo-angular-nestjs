import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { WORKSPACE_ROLE, type WorkspaceRoleType } from '@/shared/constants/management.constant';
import { Opaque } from '@/shared/types/common.type';

export type GroupWorkspaceAccess = Opaque<
  { groupId: string; workspaceRole: WorkspaceRoleType },
  'GroupWorkspaceAccess'
>;

export const GroupWorkspaceAccess = {
  create: (args: { groupId: string; workspaceRole: WorkspaceRoleType }): GroupWorkspaceAccess => {
    validate(args);

    return args;
  },
};

function validate(args: {
  groupId: string;
  workspaceRole: string;
}): asserts args is GroupWorkspaceAccess {
  const Schema = z.object({
    groupId: z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/),
    workspaceRole: z.enum(WORKSPACE_ROLE),
  });
  const result = Schema.safeParse(args);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
