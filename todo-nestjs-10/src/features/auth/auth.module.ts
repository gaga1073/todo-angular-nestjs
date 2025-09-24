import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClsModule } from 'nestjs-cls';
import { AuthController } from '@/auth/controllers/auth.controller';
import { AuthService } from '@/auth/services/auth.service';
import { JwtStrategy } from '@/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/auth/strategies/login.strategy';
import { RefreshTokenJwtStrategy } from '@/auth/strategies/refresh-token-jwt.strategy';
import { UserModule } from '@/user-management/user.module';

@Module({
  imports: [
    UserModule,
    ClsModule,
    JwtModule.registerAsync({
      useFactory: () => ({ secret: 'MY_SUPER_SECRET_KEY' }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
