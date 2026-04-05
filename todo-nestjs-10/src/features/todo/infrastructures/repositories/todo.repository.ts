import { Injectable } from '@nestjs/common';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Todo } from '@/features/todo/domain/entities/todo';
import { ITodoRepository } from '@/features/todo/domain/repositories/todo-repository.interface';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class TodoRepository implements ITodoRepository {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly prisma: TransactionHost<TransactionalAdapterPrisma>,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(TodoRepository.name);
  }

  public async restoreAggregate(todoId: string): Promise<{ todo: Todo; version: number }> {
    try {
      const row = await this.prisma.tx.todoModel.findUniqueOrThrow({
        where: {
          id: todoId,
        },
      });

      const entity = Todo.restore({
        id: row.id,
        title: row.title,
        projectId: row.projectId,
        description: row.description,
        status: row.status,
        dueDate: row.dueDate,
        assigneeId: row.assigneeId ?? undefined,
        createById: row.createById,
        isDeleted: row.isDeleted,
        createAt: row.createAt,
        updateAt: row.updateAt,
      });

      return { todo: entity, version: row.version };
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.restoreAggregate.name,
      });
      return handlePrismaError(error);
    }
  }

  public async create(todo: Todo): Promise<void> {
    try {
      await this.prisma.tx.todoModel.create({
        data: {
          id: todo.id,
          title: todo.title,
          projectId: todo.projectId,
          description: todo.description,
          status: todo.status,
          dueDate: todo.dueDate,
          assigneeId: todo.assigneeId,
          createById: todo.createById,
          isDeleted: todo.isDeleted,
          createAt: todo.createAt,
          updateAt: todo.updateAt,
        },
      });
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.create.name,
      });
      return handlePrismaError(error);
    }
  }

  public async save(todo: Todo, version: number): Promise<void> {
    try {
      await this.prisma.tx.todoModel.update({
        where: { id: todo.id, version },
        data: {
          title: todo.title,
          projectId: todo.projectId,
          description: todo.description,
          status: todo.status,
          dueDate: todo.dueDate,
          assigneeId: todo.assigneeId,
          createById: todo.createById,
          isDeleted: todo.isDeleted,
          createAt: todo.createAt,
          updateAt: todo.updateAt,
        },
      });
    } catch (error) {
      this.appLogger.error('データベースエラーが発生しました。', error, {
        method: this.save.name,
      });
      return handlePrismaError(error);
    }
  }
}
