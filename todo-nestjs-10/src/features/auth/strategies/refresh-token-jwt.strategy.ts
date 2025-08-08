import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { User } from 'src/features/user/domain/entities/user';
import { UserService } from 'src/features/user/services/user.service';
import { DecodedToken } from './decode-token.type';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-token-jwt',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: (req: FastifyRequest) =>
        req?.cookies?.['refresh_token'] ?? null,
      ignoreExpiration: false,
      secretOrKey: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
    });
  }

  async validate(props: DecodedToken): Promise<User> {
    const user = await this.userService.findUserById(props.id);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid User! User may has been deleted from the system.',
      );
    }

    return user;
  }
}
