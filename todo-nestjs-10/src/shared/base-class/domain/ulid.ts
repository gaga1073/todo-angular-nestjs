import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type Ulid = Opaque<string, 'Ulid'>;

export const Ulid = {
  create: (value: string): Ulid => {
    validate(value);

    return value;
  },
  newCreate: (): Ulid => {
    return ulid() as Ulid;
  },
};

function validate(value: string): asserts value is Ulid {
  const Schema = z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
