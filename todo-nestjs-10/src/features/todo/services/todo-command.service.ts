import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '@/features/auth/dto/login.response';
import { Todo } from '@/features/todo/domain/entities/todo';
import {
  ITodoRepository,
  ITodoRepositoryToken,
} from '@/features/todo/domain/repositories/todo-repository.interface';
import { PatchTodoRequest } from '@/features/todo/dto/request/patch-todo.request';
import { PostTodoRequest } from '@/features/todo/dto/request/post-todo.request';
import { PatchTodoResponse } from '@/features/todo/dto/response/patch-todo.response';
import { PostTodoResponse } from '@/features/todo/dto/response/post-todo.response';

@Injectable()
export class TodoCommandService {
  constructor(@Inject(ITodoRepositoryToken) private readonly todoRepository: ITodoRepository) {}

  public async createTodos(
    loginUser: UserDto,
    projectId: string,
    request: PostTodoRequest,
  ): Promise<PostTodoResponse> {
    const todo = Todo.create({
      title: request.title,
      projectId: projectId,
      description: request.description,
      status: request.status,
      dueDate: request.dueDate,
      assigneeId: request.assigneeId,
      createById: loginUser.id,
    });

    await this.todoRepository.create(todo);

    return plainToInstance(PostTodoResponse, {
      id: todo.id,
      title: todo.title,
      projectId: todo.projectId,
      description: todo.description,
      status: todo.status,
      dueDate: todo.dueDate,
      assigneeId: todo.assigneeId,
      createById: todo.createById,
      createAt: todo.createAt,
      updateAt: todo.updateAt,
    });
  }

  public async updateTodo(todoId: string, request: PatchTodoRequest): Promise<PatchTodoResponse> {
    const { todo, version } = await this.todoRepository.restoreAggregate(todoId);

    todo.update({
      title: request.title,
      description: request.description,
      status: request.status,
      dueDate: request.dueDate,
      assigneeId: request.assigneeId,
    });

    await this.todoRepository.save(todo, version);

    return plainToInstance(PatchTodoResponse, {
      id: todo.id,
      title: todo.title,
      projectId: todo.projectId,
      description: todo.description,
      status: todo.status,
      dueDate: todo.dueDate,
      assigneeId: todo.assigneeId,
      createById: todo.createById,
      createAt: todo.createAt,
      updateAt: todo.updateAt,
    });
  }

  public async deleteTodo(projectId: string, todoId: string): Promise<void> {
    const { todo, version } = await this.todoRepository.restoreAggregate(todoId);

    const isSameProject = todo.projectId === projectId;
    if (!isSameProject) {
      throw new ForbiddenException('指定されたTodoはプロジェクトに属していません。');
    }

    todo.delete();

    await this.todoRepository.save(todo, version);
  }
}
