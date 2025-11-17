import { BadRequestException } from '@nestjs/common';
import z from 'zod';
import { Opaque } from '@/shared/types/common.type';

export type Email = Opaque<string, 'Email'>;

export const Email = {
  create: (value: string): Email => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is Email {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#basic_validation
   */
  const regex =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;

  const Schema = z.string().regex(regex);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException('メールアドレス形式が不正です');
  }
}
