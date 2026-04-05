import { Todo } from '@/features/todo/domain/entities/todo';

export const ITodoRepositoryToken = Symbol('ITodoRepository');

export interface ITodoRepository {
  restoreAggregate(todoId: string): Promise<{ todo: Todo; version: number }>;
  create(todo: Todo): Promise<void>;
  save(todo: Todo, version: number): Promise<void>;
}
