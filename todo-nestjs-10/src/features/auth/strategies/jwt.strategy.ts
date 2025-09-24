import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from '@/auth/dto/login.response';
import { DecodedToken } from '@/core/types/decode-token.type';
import { UserQueryService } from '@/user-management/services/user-query.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access-token-jwt') {
  constructor(private readonly userQueryService: UserQueryService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
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
      throw new InternalServerErrorException(error);
    }
  }
}
