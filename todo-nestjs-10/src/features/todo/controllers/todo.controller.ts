import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetTodosResponse } from '@/features/todo/dto/response/get-todos.response';
import { TodoQueryService } from '@/features/todo/services/todo-query.service';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller('/todos')
@ApiTags('Todo')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, UserRolesGuard)
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
  @ApiOkResponse({ description: 'Success', type: GetTodosResponse })
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
