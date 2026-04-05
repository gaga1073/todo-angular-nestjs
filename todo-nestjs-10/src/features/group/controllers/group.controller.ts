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
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from '@/features/auth/dto/login.response';
import { GroupIdParam } from '@/features/group/dto/param/group-id.param';
import { GroupTypeQuery } from '@/features/group/dto/query/group-classification.query';
import { PatchGroupRequest } from '@/features/group/dto/request/patch-group.request';
import { PostGroupSearchRequest } from '@/features/group/dto/request/post-group-search.request';
import { PostGroupRequest } from '@/features/group/dto/request/post-group.request';
import { GetGroupsByUserIdResponse } from '@/features/group/dto/response/get-group-by-user-id.response';
import { GetGroupResponse } from '@/features/group/dto/response/get-group.response';
import { GetGroupsResponse } from '@/features/group/dto/response/get-groups.response';
import { PatchGroupResponse } from '@/features/group/dto/response/patch-group.response';
import { PostGroupSearchResponse } from '@/features/group/dto/response/post-group-search.response';
import { PostGroupResponse } from '@/features/group/dto/response/post-group.response';
import { GroupCommandService } from '@/features/group/services/group-command.service';
import { GroupQueryService } from '@/features/group/services/group-query.service';
import { UserIdParam } from '@/features/user/dto/param/user-id.param';
import { UserSearchQuery } from '@/features/user/dto/query/user-search.query';
import { GROUP_CLASSIFICATION } from '@/shared/constants/management.constant';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UserRole, UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller()
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class GroupController {
  private appLogger: AppLogger;

  constructor(
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly groupQueryService: GroupQueryService,
    private readonly groupCommandService: GroupCommandService,
  ) {
    this.appLogger = this.appLoggerFactory.create(GroupController.name);
  }

  @Get('/groups')
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `グループの一覧取得`,
    description: `
  グループの一覧を取得します。

  ### 権限
  - admin権限: すべてのグループを取得します。
  - general権限: ログインユーザーが所属するグループの一覧を取得します。
  `,
  })
  @ApiOkResponse({ description: 'Success', type: [GetGroupsResponse] })
  public async getGroups(@AuthUser() loginUser: UserDto): Promise<GetGroupsResponse[]> {
    this.appLogger.info('[GET] /groups is invoked', { method: this.getGroups.name });
    const response = await this.groupQueryService.findGroups(loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/groups/:groupId')
  @ApiParam({ name: 'groupId' })
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `特定のグループ取得`,
    description: `
  グループIDに紐づくグループの一覧を取得します。

  ### 権限
  - admin権限: 指定IDのグループの情報を取得します。
  - general権限: ログインユーザーが所属するグループの一覧を取得します。
  `,
  })
  @ApiQuery({ name: 'groupType', example: 'public', required: false })
  @ApiOkResponse({ description: 'Success', type: GetGroupResponse })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getGroup(
    @Param() { groupId }: GroupIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetGroupResponse> {
    this.appLogger.info(`[GET] /groups/${groupId} is invoked`, { method: this.getGroup.name });
    const response = this.groupQueryService.findGroup(groupId, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/users/:userId/groups')
  @ApiParam({ name: 'userId' })
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `指定ユーザーが所属するグループの取得`,
    description: `
  指定したユーザーIDのユーザーが所属するグループの一覧を取得する

  ### 権限
  - admin権限: すべてのユーザーIDを指定できます
  - general権限: ログインユーザー以外のユーザーIDの指定不可
  `,
  })
  @ApiQuery({ name: 'groupType', enum: GROUP_CLASSIFICATION, required: false })
  @ApiOkResponse({ description: 'Success', type: [GetGroupsByUserIdResponse] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async getGroupByUserId(
    @Param() { userId }: UserIdParam,
    @Query() { groupType }: GroupTypeQuery,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetGroupsByUserIdResponse[]> {
    this.appLogger.info(`[GET] /users/${userId}/groups is invoked`, {
      method: this.getGroupByUserId.name,
    });
    const response = await this.groupQueryService.findGroupsByUserId(userId, loginUser, groupType);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/groups')
  @HttpCode(201)
  @UserRole('admin')
  @ApiOperation({
    summary: `グループ作成`,
    description: `
  新規グループの作成処理を実行します。
  
  ### 権限
  - admin権限: 作成可能
  - general権限: 呼び出し不可
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PostGroupResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async PostGroup(@Body() body: PostGroupRequest): Promise<PostGroupResponse> {
    this.appLogger.info('[POST] /groups is invoked', { method: this.PostGroup.name });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const response = await this.groupCommandService.createGroup(body);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Patch('/groups/:groupId')
  @ApiParam({ name: 'groupId' })
  @UserRole('admin')
  @ApiOperation({
    summary: `グループ情報更新`,
    description: `
  グループ情報を更新します。

  ### 権限
  - admin権限: 更新可能
  - general権限: 呼び出し不可
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PatchGroupResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async patchGroup(
    @Param() { groupId }: GroupIdParam,
    @Body() body: PatchGroupRequest,
  ): Promise<PatchGroupResponse> {
    this.appLogger.info(`[PATCH] /groups/${groupId} is invoked`, { method: this.patchGroup.name });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const response = await this.groupCommandService.updateGroup(groupId, body);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/groups/search')
  @HttpCode(200)
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `グループ一覧の検索`,
    description: `
  グループを指定した条件で検索を行います。

  ### 権限
  - admin権限: すべてのグループを検索できます。
  - general権限: ログインユーザーが所属するグループの中から検索します。
  `,
  })
  @ApiQuery({ name: 'groupType', enum: GROUP_CLASSIFICATION, required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'pageSize', example: 10, required: false })
  @ApiOkResponse({ description: 'Success', type: PostGroupSearchResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async postGroupSearch(
    @AuthUser() loginUser: UserDto,
    @Query() { groupType, page, pageSize }: UserSearchQuery,
    @Body() body: PostGroupSearchRequest,
  ): Promise<PostGroupSearchResponse> {
    this.appLogger.info(`[POST] /groups/search is invoked`, { method: this.postGroupSearch.name });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const pagination =
      page !== undefined && pageSize !== undefined ? { page: page, pageSize: pageSize } : undefined;

    const response = await this.groupQueryService.findSearch(
      loginUser,
      body,
      groupType,
      pagination,
    );

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Delete('/groups/:groupId')
  @HttpCode(204)
  @ApiParam({ name: 'groupId' })
  @UserRole('admin')
  @ApiOperation({
    summary: `グループ削除`,
    description: `
  グループを削除します。

  ### 権限
  - admin権限: 削除可能
  - general権限: 呼び出し不可
  `,
  })
  @ApiNoContentResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async deleteGroup(@Param() { groupId }: GroupIdParam): Promise<void> {
    this.appLogger.info(`[DELETE] /groups/${groupId} is invoked`, {
      method: this.deleteGroup.name,
    });

    await this.groupCommandService.deleteGroup(groupId);
    return;
  }
}
