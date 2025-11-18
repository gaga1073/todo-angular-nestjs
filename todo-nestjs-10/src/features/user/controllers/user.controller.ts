import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UserRole, UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { UserCommandService } from '@/features/user/application/services/user-command.service';
import { PostUserRequest } from '@/features/user/dto/request/post-user.request';
import { PostUserResponse } from '@/features/user/dto/response/post-user-response';

@Controller('users')
@ApiTags('User')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class UserController {
  private appLogger: AppLogger;

  constructor(
    private readonly userCommandService: UserCommandService,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(UserController.name);
  }

  @Get('/')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sample() {
    return;
  }

  @Get('/sample')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sampleUser() {
    return;
  }

  @Post('/')
  @HttpCode(200)
  @UserRole('admin')
  @ApiOperation({
    summary: `ユーザー作成`,
    description: `新規ユーザーの作成処理を実行します。`,
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async postUser(@Body() body: PostUserRequest): Promise<PostUserResponse> {
    this.appLogger.info('[POST] /users is invoked', { method: this.postUser.name });

    const user = await this.userCommandService.createUser(body);

    return user;
  }
}
