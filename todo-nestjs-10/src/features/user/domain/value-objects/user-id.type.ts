import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type UserId = Opaque<string, 'UserId'>;

export const UserId = {
  create: (value: string): UserId => {
    validate(value);

    return value;
  },
  newCreate: (): UserId => {
    return ulid().toLowerCase() as UserId;
  },
};

function validate(value: string): asserts value is UserId {
  const Schema = z.string().regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
