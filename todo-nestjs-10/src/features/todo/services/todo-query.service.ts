import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { PostTodoSearchRequest } from '@/features/todo/dto/request/post-todo-search.request';
import { GetTodoResponse } from '@/features/todo/dto/response/get-todo.response';
import { GetTodosResponse } from '@/features/todo/dto/response/get-todos.response';
import { PostTodoSearchResponse } from '@/features/todo/dto/response/post-todo-search.response';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { handlePrismaError } from '@/shared/utils/prismaException.util';

@Injectable()
export class TodoQueryService {
  appLogger: AppLogger;

  constructor(
    private readonly prisma: PrismaProvider,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(TodoQueryService.name);
  }

  public async findTodos(projectId: string): Promise<GetTodosResponse[]> {
    const raw = await this.prisma.todoModel.findMany({
      where: {
        projectId: projectId,
      },
    });

    return plainToInstance(GetTodosResponse, raw);
  }

  public async findTodoById(projectId: string, todoId: string): Promise<GetTodoResponse> {
    const raw = await this.prisma.todoModel.findUnique({
      where: {
        id: todoId,
        projectId: projectId,
      },
    });

    return plainToInstance(GetTodoResponse, raw);
  }

  public async findSearch(
    projectId: string,
    request: PostTodoSearchRequest,
    pagination?: { page: number; pageSize: number },
  ): Promise<PostTodoSearchResponse> {
    try {
      const { title, status, dueDate, assigneeId, createById } = request;

      let skipAndTake;

      if (pagination !== undefined) {
        skipAndTake = {
          skip: pagination.pageSize * (pagination.page - 1),
          take: pagination.pageSize,
        };
      }

      const where: Prisma.TodoModelWhereInput = {
        projectId: projectId,
        ...(title ? { title: { contains: title } } : undefined),
        ...(status ? { status: status } : undefined),
        ...(dueDate ? { dueDate: dueDate } : undefined),
        ...(assigneeId
          ? {
              assignee: {
                id: assigneeId,
              },
            }
          : undefined),
        ...(createById
          ? {
              createBy: {
                id: createById,
              },
            }
          : undefined),
        isDeleted: false,
      };

      const rows = await this.prisma.todoModel.findMany({
        where: where,
        include: {
          assignee: true,
          createBy: true,
        },
        ...skipAndTake,
      });

      const totalRowCount = await this.prisma.todoModel.count({
        where: where,
      });

      return plainToInstance(PostTodoSearchResponse, {
        items: rows.map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          status: row.status,
          dueDate: row.dueDate,
          assignee: {
            id: row.assigneeId,
            name: row.assignee?.name,
          },
          createBy: {
            id: row.createById,
            name: row.createBy?.name,
          },
          createdAt: row.createAt,
          updatedAt: row.updateAt,
        })),
        ...(pagination !== undefined
          ? {
              pagination: {
                currentPage: pagination.page,
                pageSize: pagination.pageSize,
                totalPages: Math.ceil(totalRowCount / pagination.pageSize),
                totalItems: totalRowCount,
              },
            }
          : undefined),
      });
    } catch (error) {
      this.appLogger.error('Database error', error, { method: this.findSearch.name });
      return handlePrismaError(error);
    }
  }
}
