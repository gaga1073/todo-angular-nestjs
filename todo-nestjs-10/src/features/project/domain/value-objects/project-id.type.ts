import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type ProjectId = Opaque<string, 'ProjectId'>;

export const ProjectId = {
  create: (value: string): ProjectId => {
    validate(value);

    return value;
  },
  newCreate: (): ProjectId => {
    return ulid().toLowerCase() as ProjectId;
  },
};

function validate(value: string): asserts value is ProjectId {
  const Schema = z.string().regex(/^[0-7][0-9a-hjkmnp-tv-z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
