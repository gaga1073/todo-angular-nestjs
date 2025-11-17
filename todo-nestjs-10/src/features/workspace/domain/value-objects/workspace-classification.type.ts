import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import {
  WORKSPACE_CLASSIFICATION,
  WorkspaceClassificationType,
} from '@/shared/constants/management.constant';
import { Opaque } from '@/shared/types/common.type';

export type WorkspaceClassification = Opaque<
  WorkspaceClassificationType,
  'groWorkspaceClassificationpClassification'
>;

export const WorkspaceClassification = {
  create: (value: string): WorkspaceClassification => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is WorkspaceClassification {
  const Schema = z.enum(WORKSPACE_CLASSIFICATION);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
