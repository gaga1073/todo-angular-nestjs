import { Controller, Post, HttpCode, UseGuards, Res, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FastifyReply } from 'fastify';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { LoginRequest } from '@/features/auth/dto/login.request';
import { AuthResponse, UserDto } from '@/features/auth/dto/login.response';
import { SignupRequest } from '@/features/auth/dto/signup.request';
import { AuthService } from '@/features/auth/services/auth.service';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { LocalAuthGuard } from '@/shared/guards/local-auth.guard';
import { RefreshTokenJwtAuthGuard } from '@/shared/guards/refresh-token-jwt.guard';
import { AppLogger } from '@/shared/utils/app-logger.util';
import {
  setRefreshTokenToHttpOnlyCookie,
  terminateRefreshTokenHttpOnlyCookie,
} from '@/shared/utils/response.util';

@Controller('/auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class AuthController {
  private appLogger: AppLogger;

  constructor(
    private readonly authService: AuthService,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(AuthController.name);
  }

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: `ログイン`,
    description: `Emailアドレスとパスワードでログイン処理を実行します。`,
  })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ type: AuthResponse })
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async login(
    @AuthUser() user: UserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    this.appLogger.info('[POST] /auth/login is invoked', { method: this.login.name });

    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToClass(AuthResponse, {
      user: user,
      accessToken,
    });

    return response;
  }

  @Post('/signup')
  @HttpCode(200)
  @ApiOperation({
    summary: `サインアップ`,
    description: `新規ユーザーの作成処理を実行します。`,
  })
  @ApiResponse({ type: AuthResponse })
  @ApiCreatedResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  public async signup(
    @Body() signupRequest: SignupRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    this.appLogger.info('[POST] /auth/signup is invoked', { method: this.signup.name });

    const user = await this.authService.register(signupRequest);

    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToInstance(AuthResponse, {
      user: user,
      accessToken,
    });

    return response;
  }

  @Get('/refresh-token')
  @HttpCode(200)
  @UseGuards(RefreshTokenJwtAuthGuard)
  @ApiOperation({
    summary: `アクセストークン再取得`,
    description: 'リフレッシュトークンを検証し、アクセストークンの更新を行う。',
  })
  @ApiResponse({ type: AuthResponse })
  @ApiOkResponse({ description: 'Success' })
  public async refreshToken(
    @AuthUser() user: UserDto,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    this.appLogger.info('[GET] /auth/refresh-token is invoked', { method: this.refreshToken.name });

    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToInstance(AuthResponse, {
      user: user,
      accessToken,
    });

    return response;
  }

  @Get('/logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: `ログアウト`,
    description: `ログアウト処理を実行します。`,
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  public async logout(@Res({ passthrough: true }) reply: FastifyReply): Promise<void> {
    this.appLogger.info('[GET] /auth/logout is invoked', { method: this.logout.name });
    terminateRefreshTokenHttpOnlyCookie(reply);
    return;
  }

  @Get('/me')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  public async getMe(@AuthUser() user: UserDto): Promise<UserDto> {
    this.appLogger.info('[GET] /auth/me is invoked', { method: this.logout.name });
    return user;
  }
}
