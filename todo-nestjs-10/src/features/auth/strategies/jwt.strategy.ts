import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/features/user/domain/entities/user';
import { UserService } from 'src/features/user/services/user.service';
import { DecodedToken } from './decode-token.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'access-token-jwt',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'MY_SUPER_SECRET_KEY',
    });
  }

  async validate({ id }: DecodedToken): Promise<User> {
    const user = await this.userService.findUserById(id);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid User! User may has been deleted from the system.',
      );
    }

    return user;
  }
}
