import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '@/features/auth/dto/login.response';
import { ProjectIdParam } from '@/features/todo/dto/param/project-id.param';
import { TodoIdParam } from '@/features/todo/dto/param/todo-id.param';
import { TodoSearchQuery } from '@/features/todo/dto/query/todo-search.query';
import { PostTodoSearchRequest } from '@/features/todo/dto/request/post-todo-search.request';
import { PostTodoRequest } from '@/features/todo/dto/request/post-todo.request';
import { GetTodoResponse } from '@/features/todo/dto/response/get-todo.response';
import { GetTodosResponse } from '@/features/todo/dto/response/get-todos.response';
import { PostTodoSearchResponse } from '@/features/todo/dto/response/post-todo-search.response';
import { PostTodoResponse } from '@/features/todo/dto/response/post-todo.response';
import { TodoCommandService } from '@/features/todo/services/todo-command.service';
import { TodoQueryService } from '@/features/todo/services/todo-query.service';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import {
  ProjectMembershipGuard,
  RequireProjectMembership,
} from '@/shared/guards/project-membership.guard';
import { UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller('/projects/:projectId')
@ApiTags('Todo')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, UserRolesGuard, ProjectMembershipGuard)
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class TodoController {
  private appLogger: AppLogger;

  constructor(
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly todoQueryService: TodoQueryService,
    private readonly todoCommandService: TodoCommandService,
  ) {
    this.appLogger = this.appLoggerFactory.create(TodoController.name);
  }

  @Get('/todos')
  @HttpCode(200)
  @RequireProjectMembership()
  @ApiOperation({
    summary: `TODO一覧取得`,
    description: `TODOの一覧を取得します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiOkResponse({ description: 'Success', type: [GetTodosResponse] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getTodos(@Param() { projectId }: ProjectIdParam): Promise<GetTodosResponse[]> {
    this.appLogger.info(`[GET] /projects/${projectId}/todos is invoked`, {
      method: this.getTodos.name,
    });

    const response = await this.todoQueryService.findTodos(projectId);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/todos/:todoId')
  @HttpCode(200)
  @RequireProjectMembership()
  @ApiOperation({
    summary: `TODO取得`,
    description: `TODOを取得します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiParam({ name: 'todoId', description: 'TODO ID' })
  @ApiOkResponse({ description: 'Success', type: GetTodoResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getTodoById(
    @Param('projectId') projectId: string,
    @Param('todoId') todoId: string,
  ): Promise<GetTodoResponse> {
    this.appLogger.info(`[GET] /projects/${projectId}/todos/${todoId} is invoked`, {
      method: this.getTodoById.name,
    });

    const response = await this.todoQueryService.findTodoById(projectId, todoId);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/todos')
  @HttpCode(201)
  @ApiOperation({
    summary: `TODO作成`,
    description: `新しいTODOを作成します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiResponse({ type: PostTodoResponse })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async postTodo(
    @AuthUser() loginUser: UserDto,
    @Param() { projectId }: ProjectIdParam,
    @Body() body: PostTodoRequest,
  ): Promise<PostTodoResponse> {
    this.appLogger.info(`[POST] /projects/${projectId}/todos is invoked`, {
      method: this.postTodo.name,
    });

    const response = await this.todoCommandService.createTodos(loginUser, projectId, body);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/todos/search')
  @HttpCode(200)
  @RequireProjectMembership()
  @ApiOperation({
    summary: `TODO検索`,
    description: `TODOを検索します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'pageSize', example: 10, required: false })
  @ApiResponse({ type: PostTodoSearchResponse })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async postSearchTodo(
    @Query() { page, pageSize }: TodoSearchQuery,
    @Param() { projectId }: ProjectIdParam,
    @Body() body: PostTodoSearchRequest,
  ): Promise<PostTodoSearchResponse> {
    this.appLogger.info(`[POST] /projects/${projectId}/todos/search is invoked`, {
      method: this.postSearchTodo.name,
    });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const pagination = page && pageSize ? { page, pageSize } : undefined;
    const response = await this.todoQueryService.findSearch(projectId, body, pagination);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Patch('/todos/:todoId')
  @HttpCode(200)
  @ApiOperation({
    summary: `TODO更新`,
    description: `TODOを更新します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiParam({ name: 'todoId', description: 'TODO ID' })
  @ApiOkResponse({ description: 'Success', type: GetTodoResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async patchTodo(
    @Param() { projectId }: ProjectIdParam,
    @Param() { todoId }: TodoIdParam,
    @Body() body: PostTodoRequest,
  ): Promise<GetTodoResponse> {
    this.appLogger.info(`[PATCH] /projects/${projectId}/todos/${todoId} is invoked`, {
      method: this.patchTodo.name,
    });

    const response = await this.todoCommandService.updateTodo(todoId, body);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Delete('/todos/:todoId')
  @HttpCode(204)
  @RequireProjectMembership()
  @ApiOperation({
    summary: `TODO削除`,
    description: `TODOを削除します`,
  })
  @ApiParam({ name: 'projectId', description: 'プロジェクトID' })
  @ApiParam({ name: 'todoId', description: 'TODO ID' })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async deleteTodo(
    @Param() { projectId }: ProjectIdParam,
    @Param() { todoId }: TodoIdParam,
  ): Promise<void> {
    this.appLogger.info(`[DELETE] /projects/${projectId}/todos/${todoId} is invoked`, {
      method: this.deleteTodo.name,
    });

    await this.todoCommandService.deleteTodo(projectId, todoId);

    return;
  }
}
