import {
  Injectable,
  UnauthorizedException,
  ServiceUnavailableException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateUserDomainService } from '@/core/domain-services/create-user-domain.service';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { UserDto } from '@/features/auth/dto/login.response';
import { SignupRequest } from '@/features/auth/dto/signup.request';
import { User } from '@/features/user/domain/entities/user';
import { AppLogger } from '@/shared/utils/app-logger.util';
import { comparePassword, hashPassword } from '@/shared/utils/password.util';

@Injectable()
export class AuthService {
  private readonly appLogger: AppLogger;

  constructor(
    private readonly jwtService: JwtService,
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly prisma: PrismaProvider,
    private readonly createUserDomainService: CreateUserDomainService,
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

      await comparePassword(password, user.password);

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
    const hashedPassword = await hashPassword(signupRequest.password);

    const user = User.create({
      email: signupRequest.email,
      name: signupRequest.username,
      password: hashedPassword,
      role: 'general',
    });

    await this.createUserDomainService.execute(user);

    const response = plainToInstance(UserDto, user);

    return response;
  }
}
