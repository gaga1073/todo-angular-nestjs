import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { TodoStatusType, TODO_STATUS } from '@/shared/constants/todo.constant';
import { Opaque } from '@/shared/types/common.type';

export type TodoStatus = Opaque<TodoStatusType, 'TodoStatus'>;

export const TodoStatus = {
  create: (value: string): TodoStatus => {
    validate(value);

    return value;
  },
};

function validate(value: string): asserts value is TodoStatus {
  const Schema = z.enum(TODO_STATUS);
  const result = Schema.safeParse(value);

  if (!result.success) {
    throw new BadRequestException(result.error);
  }
}
