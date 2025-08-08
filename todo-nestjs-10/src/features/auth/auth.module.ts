import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/login.strategy';
import { RefreshTokenJwtStrategy } from './strategies/refresh-token-jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({ secret: 'MY_SUPER_SECRET_KEY' }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
