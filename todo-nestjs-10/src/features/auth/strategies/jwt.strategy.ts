import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { UserDto } from '@/features/auth/dto/login.response';
import { UserQueryService } from '@/features/user/application/services/user-query.service';
import { DecodedToken } from '@/shared/types/decode-token.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-token-jwt') {
  constructor(private readonly userQueryService: UserQueryService) {
    super({
      jwtFromRequest: (req: FastifyRequest) => req?.cookies?.['access_token'] ?? null,
      ignoreExpiration: false,
      secretOrKey: 'MY_SUPER_SECRET_KEY',
    });
  }

  async validate({ id }: DecodedToken): Promise<UserDto> {
    try {
      const user = await this.userQueryService.getUserForJwtValidation(id);

      if (!user) {
        throw new UnauthorizedException('Invalid User! User may has been deleted from the system.');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
