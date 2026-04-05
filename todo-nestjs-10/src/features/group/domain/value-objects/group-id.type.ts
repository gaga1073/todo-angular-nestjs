import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type GroupId = Opaque<string, 'GroupId'>;

export const GroupId = {
  create: (value: string): GroupId => {
    validate(value);

    return value;
  },
  newCreate: (): GroupId => {
    return ulid().toLowerCase() as GroupId;
  },
};

function validate(value: string): asserts value is GroupId {
  const Schema = z.string().regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
