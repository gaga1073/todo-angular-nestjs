import { Controller, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { FastifyReply } from 'fastify';
import { AuthUser } from 'src/core/decorators/auth-user.decorator';
import { LocalAuthGuard } from 'src/core/guards/local-auth.guard';
import { setRefreshTokenToHttpOnlyCookie } from 'src/core/utils/response';
import { User } from 'src/features/user/domain/entities/user';
import { LoginRequest } from '../dto/login.request';
import { LoginResponse } from '../dto/login.response';
import { AuthService } from '../services/auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginRequest })
  public async login(
    @AuthUser() user: User,
    @Res({ passthrough: true }) reply: FastifyReply,
  ): Promise<LoginResponse> {
    const refreshToken = await this.authService.signJwtRefreshToken(user);

    setRefreshTokenToHttpOnlyCookie(reply, refreshToken);

    const accessToken = await this.authService.signJwtAccessToken(user);

    const response = plainToClass(LoginResponse, {
      user: user.toPlainObject(),
      accessToken,
    });

    console.log(response);

    return response;
  }
}
