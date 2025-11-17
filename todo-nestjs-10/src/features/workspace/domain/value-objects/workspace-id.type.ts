import { BadRequestException } from '@nestjs/common';
import { ulid } from 'ulid';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type WorkspaceId = Opaque<string, 'WorkspaceId'>;

export const WorkspaceId = {
  create: (value: string): WorkspaceId => {
    validate(value);

    return value;
  },
  newCreate: (): WorkspaceId => {
    return ulid() as WorkspaceId;
  },
};

function validate(value: string): asserts value is WorkspaceId {
  const Schema = z.string().regex(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
