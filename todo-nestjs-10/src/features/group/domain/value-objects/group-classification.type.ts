import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import {
  GROUP_CLASSIFICATION,
  GroupClassificationType,
} from '@/shared/constants/management.constant';
import { Opaque } from '@/shared/types/common.type';

export type GroupClassification = Opaque<GroupClassificationType, 'groupClassification'>;

export const GroupClassification = {
  create: (value: string): GroupClassification => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is GroupClassification {
  const Schema = z.enum(GROUP_CLASSIFICATION);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
