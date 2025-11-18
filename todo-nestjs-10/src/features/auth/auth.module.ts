import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClsModule } from 'nestjs-cls';
import { AuthController } from '@/features/auth/controllers/auth.controller';
import { AuthService } from '@/features/auth/services/auth.service';
import { JwtStrategy } from '@/features/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/features/auth/strategies/login.strategy';
import { RefreshTokenJwtStrategy } from '@/features/auth/strategies/refresh-token-jwt.strategy';
import { UserModule } from '@/features/user/user.module';

@Module({
  imports: [
    UserModule,
    ClsModule,
    JwtModule.registerAsync({
      useFactory: () => ({ secret: 'MY_SUPER_SECRET_KEY' }),
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenJwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
