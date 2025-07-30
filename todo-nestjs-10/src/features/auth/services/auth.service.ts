import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/features/user/domain/entities/user';
import { UserService } from 'src/features/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  public async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const user = await this.userService.findUserByEmailOrFail(email);

      await user.comparePassword(password, user);

      return user;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Incorrect Username or Password');
    }
  }

  public async signJwtAccessToken(user: User): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          expiresIn: '60s', //有効期限
          algorithm: 'HS512', // 暗号化方式
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

  public async signJwtRefreshToken(user: User): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        {
          id: user.id,
          sub: user.username,
        },
        {
          // リフレッシュトークン用のシークレットキー(JwtModule.registerAsyncで登録したシークレットキーを上書き)
          secret: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
          expiresIn: '7d', //有効期限
          algorithm: 'HS512', // 暗号化方式
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
}
