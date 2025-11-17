import { BadRequestException } from '@nestjs/common';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type Password = Opaque<string, 'Password'>;

export const Password = {
  create: (value: string): Password => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is Password {
  const Schema = z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException('パスワード形式が不正です');
  }
}
