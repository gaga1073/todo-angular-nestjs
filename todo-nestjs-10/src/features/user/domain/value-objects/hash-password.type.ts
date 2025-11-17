import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type HashPassword = Opaque<string, 'HashPassword'>;

export const HashPassword = {
  create: (value: string): HashPassword => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is HashPassword {
  const Schema = z.string().length(60);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException('パスワード形式が不正です');
  }
}
