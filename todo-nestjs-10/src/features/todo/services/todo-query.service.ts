import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { GetTodosResponse } from '@/features/todo/dto/response/get-todos.response';

@Injectable()
export class TodoQueryService {
  constructor(private readonly prisma: PrismaProvider) {}

  public async findTodos(): Promise<GetTodosResponse> {
    const result = await this.prisma.todoModel.findMany({
      include: {
        assignee: true,
        createBy: true,
      },
    });

    return plainToInstance(GetTodosResponse, { todos: result });
  }
}
