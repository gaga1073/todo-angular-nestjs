import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { FastifyRequest } from 'fastify';
import { Strategy } from 'passport-jwt';
import { UserDto } from '@/auth/dto/login.response';
import { DecodedToken } from '@/core/types/decode-token.type';
import { UserQueryService } from '@/user-management/services/user-query.service';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(Strategy, 'refresh-token-jwt') {
  constructor(private readonly userQueryService: UserQueryService) {
    super({
      jwtFromRequest: (req: FastifyRequest) => req?.cookies?.['refresh_token'] ?? null,
      ignoreExpiration: false,
      secretOrKey: 'MY_REFRESH_TOKEN_SUPER_SECRET_KEY',
      algorithms: ['HS256'],
    });
  }

  async validate(props: DecodedToken): Promise<UserDto> {
    try {
      const user = await this.userQueryService.getUserForJwtValidation(props.id);

      if (!user) {
        throw new UnauthorizedException('Invalid User! User may has been deleted from the system.');
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
