import { Controller, Get, HttpCode } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { GetTodosResponse } from '@/features/todo/dto/response/get-todos.response';
import { TodoQueryService } from '@/features/todo/services/todo-query.service';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller('/todos')
@ApiTags('Todo')
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class TodoController {
  private appLogger: AppLogger;

  constructor(
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly todoQueryService: TodoQueryService,
  ) {
    this.appLogger = this.appLoggerFactory.create(TodoController.name);
  }

  @Get('/')
  @HttpCode(200)
  @ApiOperation({
    summary: `TODO一覧取得`,
    description: `TODOの一覧を取得します`,
  })
  @ApiResponse({ type: GetTodosResponse })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getTodos(): Promise<GetTodosResponse> {
    this.appLogger.info('[GET] /todos is invoked', { method: this.getTodos.name });

    const response = await this.todoQueryService.findTodos();
    return response;
  }

  // @Post('/')
  // @HttpCode(201)
  // @ApiOperation({
  //   summary: `TODO一覧取得`,
  //   description: `TODOの一覧を取得します`,
  // })
  // @ApiResponse({ type: PostTodoResponse })
  // @ApiOkResponse({ description: 'Success' })
  // @ApiBadRequestResponse({ description: 'Bad Request' })
  // public postTodo(@Body() body: PostTodoRequest): Promise<PostTodoResponse> {
  //   this.appLogger.info('[POST] /todos is invoked', { method: this.postTodo.name });
  // }
}
