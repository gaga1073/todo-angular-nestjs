import { BadRequestException } from '@nestjs/common';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type GroupMembership = Opaque<string, 'UserGroupMembership'>;

export const GroupMembership = {
  create: (value: string): GroupMembership => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is GroupMembership {
  const Schema = z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
