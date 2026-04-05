import {
  BadRequestException,
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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GroupIdParam } from '@/features/group/dto/param/group-id.param';
import { GetGroupsByUserIdResponse } from '@/features/group/dto/response/get-group-by-user-id.response';
import { ProjectIdParam } from '@/features/project/dto/param/project-id.param';
import { UserCommandService } from '@/features/user/application/services/user-command.service';
import { UserQueryService } from '@/features/user/application/services/user-query.service';
import { UserIdParam } from '@/features/user/dto/param/user-id.param';
import { UserSearchQuery } from '@/features/user/dto/query/user-search.query';
import { PatchUserRequest } from '@/features/user/dto/request/patch-user.request';
import { PostUserSearchRequest } from '@/features/user/dto/request/post-user-search.request';
import { PostUserRequest } from '@/features/user/dto/request/post-user.request';
import { GetUserResponse } from '@/features/user/dto/response/get-user.response';
import { GetUsersResponse } from '@/features/user/dto/response/get-users.response';
import { PatchUserResponse } from '@/features/user/dto/response/patch-user.response';
import { PostUserSearchResponse } from '@/features/user/dto/response/post-user-search.response';
import { PostUserResponse } from '@/features/user/dto/response/post-user.response';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { GROUP_CLASSIFICATION } from '@/shared/constants/management.constant';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UserRole, UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller()
@ApiTags('User')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class UserController {
  private appLogger: AppLogger;

  constructor(
    private readonly userCommandService: UserCommandService,
    private readonly userQueryService: UserQueryService,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserController.name);
  }

  @Get('/users')
  @HttpCode(200)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー一覧取得`,
    description: `
  ユーザーの一覧を取得します。
  
  ### 権限
  - admin権限: すべてのユーザーを取得します
  - general権限: 呼び出し不可
  `,
  })
  @ApiOkResponse({ description: 'Success', type: [GetUsersResponse] })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async getUsers(@AuthUser() loginUser: UserDto): Promise<GetUsersResponse[]> {
    this.appLogger.info('[GET] /users is invoked', { method: this.getUsers.name });
    const response = await this.userQueryService.findUsers(loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/users/:userId')
  @HttpCode(200)
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `ユーザー取得`,
    description: `
  ユーザーIDに紐づく取得します。
  
  ### 権限
  - admin権限: 指定IDのユーザーの情報を取得します。
  - general権限: ログインユーザーのIDのみ指定可能です。
  `,
  })
  @ApiOkResponse({ description: 'Success', type: GetUserResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  public async getUser(
    @Param() { userId }: UserIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetUserResponse> {
    this.appLogger.info('[GET] /users is invoked', { method: this.getUser.name });
    const response = await this.userQueryService.findUser(userId, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/groups/:groupId/users')
  @HttpCode(200)
  @ApiParam({ name: 'groupId' })
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `指定グループに所属するユーザーの取得`,
    description: `
  指定したグループIDに所属するユーザーの一覧を取得する
  
  ### 権限
  - admin権限: 指定IDのグループに所属するユーザーの情報を取得します。
  - general権限: ログインユーザーが所属するグループのIDのみ指定可能です。
  `,
  })
  @ApiOkResponse({ description: 'Success', type: [GetGroupsByUserIdResponse], isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  public async getUsersByGroupId(
    @Param() { groupId }: GroupIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetGroupsByUserIdResponse[]> {
    this.appLogger.info(`[GET] /groups/${groupId}/users is invoked`, {
      method: this.getUsersByGroupId.name,
    });
    const response = await this.userQueryService.findUsersByGroupId(groupId, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/projects/:projectId/users')
  @HttpCode(200)
  @ApiParam({ name: 'projectId' })
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `指定プロジェクトに所属するユーザーの取得`,
    description: `
  指定したプロジェクトIDに所属するユーザーの一覧を取得する
  
  ### 権限
  - admin権限: 指定IDのプロジェクトに所属するユーザーの情報を取得します。
  - general権限: ログインユーザーが所属するプロジェクトのIDのみ指定可能です。
  `,
  })
  @ApiOkResponse({ description: 'Success', type: [GetUsersResponse], isArray: true })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  public async getUsersByProjectId(
    @Param() { projectId }: ProjectIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetUsersResponse[]> {
    this.appLogger.info(`[GET] /projects/${projectId}/users is invoked`, {
      method: this.getUsersByProjectId.name,
    });
    const response = await this.userQueryService.findByProjectId(projectId, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/users')
  @HttpCode(201)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー作成`,
    description: `
  新規ユーザーの作成処理を実行します。
  
  ### 権限
  - admin権限: 作成可能
  - general権限: 呼び出し不可
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PostUserResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async postUser(@Body() body: PostUserRequest): Promise<PostUserResponse> {
    this.appLogger.info('[POST] /users is invoked', { method: this.postUser.name });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const response = await this.userCommandService.createUser(body);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/users/search')
  @HttpCode(200)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー一覧の検索`,
    description: `
  ユーザーを指定した条件で検索を行います。
  
  ### 権限
  - admin権限: 作成可能
  - general権限: 呼び出し不可
  `,
  })
  @ApiQuery({ name: 'groupType', enum: GROUP_CLASSIFICATION, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'pageSize', example: 10, required: false })
  @ApiCreatedResponse({ description: 'Success', type: PostUserSearchResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async postUserSearch(
    @AuthUser() loginUser: UserDto,
    @Query() { groupType, page, pageSize }: UserSearchQuery,
    @Body() body: PostUserSearchRequest,
  ): Promise<PostUserSearchResponse> {
    this.appLogger.info('[POST] /users/search is invoked', { method: this.postUserSearch.name });
    this.appLogger.debug(`request body ${JSON.stringify(body)}`, {
      method: this.postUserSearch.name,
    });

    if (!((page !== undefined) === (pageSize !== undefined))) {
      throw new BadRequestException();
    }

    const pagination =
      page !== undefined && pageSize !== undefined ? { page: page, pageSize: pageSize } : undefined;

    const response = await this.userQueryService.findSearch(loginUser, body, groupType, pagination);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Patch('/users/:userId')
  @HttpCode(200)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー情報更新`,
    description: `
  ユーザー情報の更新を行います。

  ### 権限
  - admin権限: 作成可能
  - general権限: 呼び出し不可    
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PatchUserResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  public async patchUser(
    @Param() { userId }: UserIdParam,
    @Body() body: PatchUserRequest,
    @AuthUser() loginUser: UserDto,
  ): Promise<PatchUserResponse> {
    this.appLogger.info(`[PATCH] /users/${userId} is invoked`, { method: this.patchUser.name });
    this.appLogger.debug(`request body ${JSON.stringify(body)}`);

    const response = await this.userCommandService.updateUser(userId, body, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Delete('/users/:userId')
  @HttpCode(204)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー情報更新`,
    description: `
  ユーザー情報の更新処理を実行します。
  
  ### 権限
  - admin権限: 更新可能
  - general権限: 呼び出し不可  
  `,
  })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  public async deleteUser(
    @Param() { userId }: UserIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<void> {
    this.appLogger.info('[DELETE] /users is invoked', { method: this.deleteUser.name });
    await this.userCommandService.deleteUser(userId, loginUser);
    return;
  }
}
