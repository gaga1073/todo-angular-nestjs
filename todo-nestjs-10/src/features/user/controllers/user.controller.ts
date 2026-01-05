import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserCommandService } from '@/features/user/application/services/user-command.service';
import { UserQueryService } from '@/features/user/application/services/user-query.service';
import { GroupClassificationQuery } from '@/features/user/dto/query/group-classification.query';
import { PostUserSearchRequest } from '@/features/user/dto/request/post-user-search.request';
import { PostUserRequest } from '@/features/user/dto/request/post-user.request';
import { PutUserRequest } from '@/features/user/dto/request/put-user.request';
import { GetUserResponse } from '@/features/user/dto/response/get-user.response';
import { GetUsersResponse } from '@/features/user/dto/response/get-users.response';
import { PostUserSearchResponse } from '@/features/user/dto/response/post-user-search.response';
import { PostUserResponse } from '@/features/user/dto/response/post-user.response';
import { PutUserResponse } from '@/features/user/dto/response/put-user.response';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserIdParam } from '@/features/user/dto/user-id-param.dto';
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
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `ユーザー一覧取得`,
    description: `ユーザーの一覧を取得します。`,
  })
  @ApiQuery({ name: 'groupType', example: 'public', required: false })
  @ApiOkResponse({ description: 'Success', type: GetUsersResponse })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getUsers(
    @AuthUser() loginUser: UserDto,
    @Query() { groupType }: GroupClassificationQuery,
  ): Promise<GetUsersResponse> {
    this.appLogger.info('[GET] /users is invoked', { method: this.getUsers.name });
    const response = await this.userQueryService.findUsers(loginUser, groupType);
    return response;
  }

  @Get('/users/:userId')
  @HttpCode(200)
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `ユーザー取得`,
    description: `ユーザーIDに紐づく取得します。`,
  })
  @ApiOkResponse({ description: 'Success', type: GetUserResponse })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async getUser(
    @Param() { userId }: UserIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<GetUserResponse> {
    this.appLogger.info('[GET] /users is invoked', { method: this.getUsers.name });
    const response = await this.userQueryService.findUser(userId, loginUser);
    return response;
  }

  @Post('/users')
  @HttpCode(201)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー作成`,
    description: `新規ユーザーの作成処理を実行します。`,
  })
  @ApiOkResponse({ description: 'Success', type: PostUserResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async postUser(@Body() body: PostUserRequest): Promise<PostUserResponse> {
    this.appLogger.info('[POST] /users is invoked', { method: this.postUser.name });
    const response = await this.userCommandService.createUser(body);
    return response;
  }

  @Post('/users/search')
  @HttpCode(200)
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `ユーザー一覧の検索`,
    description: `ユーザーを指定した条件で検索を行います。`,
  })
  @ApiQuery({ name: 'groupType', example: 'public', required: false })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'pageSize', example: 10, required: false })
  @ApiOkResponse({ description: 'Success', type: GetUsersResponse })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async postUserSearch(
    @AuthUser() loginUser: UserDto,
    @Query() { groupType, page, pageSize }: GroupClassificationQuery,
    @Body() body: PostUserSearchRequest,
  ): Promise<PostUserSearchResponse> {
    this.appLogger.info('[POST] /users/search is invoked', { method: this.postUserSearch.name });

    if (!((page !== undefined) === (pageSize !== undefined))) {
      throw new BadRequestException();
    }

    const pagenation =
      page !== undefined && pageSize !== undefined ? { page: page, pageSize: pageSize } : undefined;

    const response = await this.userQueryService.findSearch(loginUser, body, groupType, pagenation);
    return response;
  }

  @Put('/users/:userId')
  @HttpCode(200)
  @UserRole('admin', 'general')
  @ApiOperation({
    summary: `ユーザー情報更新`,
    description: `ユーザー情報の更新処理を実行します。`,
  })
  @ApiOkResponse({ description: 'Success', type: PutUserResponse })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async putUser(
    @Param() { userId }: UserIdParam,
    @Body() body: PutUserRequest,
    @AuthUser() loginUser: UserDto,
  ): Promise<PutUserResponse> {
    this.appLogger.info('[POST] /users is invoked', { method: this.putUser.name });
    const response = await this.userCommandService.updateUser(userId, body, loginUser);
    return response;
  }

  @Delete('/users/:userId')
  @HttpCode(200)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー情報更新`,
    description: `ユーザー情報の更新処理を実行します。`,
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async deleteUser(
    @Param() { userId }: UserIdParam,
    @AuthUser() loginUser: UserDto,
  ): Promise<void> {
    this.appLogger.info('[POST] /users is invoked', { method: this.deleteUser.name });
    await this.userCommandService.deleteUser(userId, loginUser);
    return;
  }
}
