import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type TodoId = Opaque<string, 'TodoId'>;

export const TodoId = {
  create: (value: string): TodoId => {
    validate(value);

    return value;
  },
  newCreate: (): TodoId => {
    return ulid() as TodoId;
  },
};

function validate(value: string): asserts value is TodoId {
  const Schema = z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
