import {
  Body,
  Controller,
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
import { setRefreshTokenToHttpOnlyCookie } from 'src/core/utils/response';
import { User } from 'src/features/user/domain/entities/user';
import { LoginRequest } from '../dto/login.request';
import { LoginResponse } from '../dto/login.response';
import { SignupRequest } from '../dto/signup.request';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ type: LoginResponse })
  public async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponse> {
    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToClass(LoginResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    console.log(response);

    return response;
  }

  @Post('signup')
  @HttpCode(200)
  public async signup(
    @Body() signupRequest: SignupRequest,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponse> {
    const user = await this.authService.register(signupRequest);

    const refreshToken = await this.authService.createJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.createJwtAccessToken(user);

    const response = plainToInstance(LoginResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    return response;
  }
}
