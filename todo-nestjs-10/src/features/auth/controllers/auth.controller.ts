import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { plainToClass, plainToInstance } from 'class-transformer';
import { FastifyReply } from 'fastify';
import { AuthUser } from 'src/core/decorators/auth-user.decorator';
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { RefreshTokenJwtAuthGuard } from 'src/core/guards/refresh-token-jwt.guard';
import { setRefreshTokenToHttpOnlyCookie } from 'src/core/utils/response.util';
import { User } from 'src/features/user/domain/entities/user';
import { LoginRequest } from '../dto/login.request';
import { AuthResponse } from '../dto/login.response';
import { SignupRequest } from '../dto/signup.request';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ type: AuthResponse })
  public async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToClass(AuthResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    return response;
  }

  @Post('/signup')
  @HttpCode(200)
  public async signup(
    @Body() signupRequest: SignupRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    const user = await this.authService.register(signupRequest);

    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToInstance(AuthResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    return response;
  }

  @Get('/refresh-token')
  @HttpCode(200)
  @UseGuards(RefreshTokenJwtAuthGuard)
  @ApiResponse({ type: AuthResponse })
  public async refreshToken(
    @AuthUser() user: User,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<AuthResponse> {
    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToInstance(AuthResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    return response;
  }
}
