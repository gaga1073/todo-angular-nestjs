import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { WORKSPACE_ROLE, type ProjectRoleType } from '@/shared/constants/management.constant';
import { Opaque } from '@/shared/types/common.type';

export type GroupProjectAccess = Opaque<
  { groupId: string; projectRole: ProjectRoleType },
  'GroupProjectAccess'
>;

export const GroupProjectAccess = {
  create: (args: { groupId: string; projectRole: ProjectRoleType }): GroupProjectAccess => {
    validate(args);

    return args;
  },
};

function validate(args: {
  groupId: string;
  projectRole: string;
}): asserts args is GroupProjectAccess {
  const Schema = z.object({
    groupId: z.string().regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/),
    projectRole: z.enum(WORKSPACE_ROLE),
  });
  const result = Schema.safeParse(args);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
