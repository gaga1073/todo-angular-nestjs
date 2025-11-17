import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { USER_ROLE, UserRoleType } from '@/shared/constants/management.constant';
import { Opaque } from '@/shared/types/common.type';

export type Role = Opaque<UserRoleType, 'Role'>;

export const Role = {
  create: (value: string): Role => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is Role {
  const Schema = z.enum(USER_ROLE);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
