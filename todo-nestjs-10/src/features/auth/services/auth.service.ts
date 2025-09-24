import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '@prisma/client';
import { UserDto } from '@/auth/dto/login.response';
import { SignupRequest } from '@/auth/dto/signup.request';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { AppLogger } from '@/core/utils/app-logger.util';
import { UserDomainService } from '@/user-management/domain/services/user-domain.service';
import { UserCommandService } from '@/user-management/services/user-command.service';

@Injectable()
export class AuthService {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly UserDomainService: UserDomainService,
    private readonly jwtService: JwtService,
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly prisma: PrismaProvider,
    private readonly userCommandService: UserCommandService,
  ) {
    this.appLogger = this.appLoggerFactory.create(AuthService.name);
  }

  public async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<UserModel> {
    try {
      const user = await this.prisma.userModel.findFirstOrThrow({
        where: {
          email: email,
          isDelete: false,
        },
      });

      await this.UserDomainService.comparePassword(password, user.password);

      return user;
    } catch (error) {
      this.appLogger.error('validate error occurd', error, { method: this.validateUser.name });
      throw new UnauthorizedException('Incorrect Username or Password');
    }
  }

  public async createJwtAccessToken(user: UserDto): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          sub: user.id,
          id: user.id,
          email: user.email,
        },
        {
          expiresIn: '1h', //有効期限
          algorithm: 'HS256', // 暗号化方式
          issuer: 'Nest Advance JWT Authentication', // 発行者(iss)
          audience: 'Authenicated Users', // 受信者(aud)
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new ServiceUnavailableException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  public async createJwtRefreshToken(user: UserDto): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          id: user.id.toString(),
          sub: user.name,
        },
        {
          // リフレッシュトークン用のシークレットキー(JwtModule.registerAsyncで登録したシークレットキーを上書き)
          secret: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
          expiresIn: '1d', //有効期限
          algorithm: 'HS256', // 暗号化方式
          issuer: 'Nest Advance JWT Authentication', // 発行者(予約クレーム:iss)
          audience: 'Authenicated Users', // 受信者(予約クレーム:aud)
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new ServiceUnavailableException(error.message);
      }
      throw new InternalServerErrorException('An unexpected error occurred.');
    }
  }

  public async register(signupRequest: SignupRequest): Promise<UserDto> {
    return await this.userCommandService.createUser(signupRequest);
  }
}
