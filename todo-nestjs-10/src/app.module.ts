import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ClsModule, ClsService, ClsStore } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { CoreModule } from '@/core/core.module';
import { AuthModule } from '@/features/auth/auth.module';
import { TodoModule } from '@/features/todo/todo.module';
import { UserModule } from '@/features/user/user.module';
import { PrismaProvider } from '@/shared/providers/prisma.provider';
import { SharedModule } from '@/shared/shared.module';
import { getEnvFilePath } from '@/shared/utils/common.util';
import { pinoConfig } from '@/shared/utils/config.util';

const envFilePath = getEnvFilePath(`${__dirname}`);

@Module({
  imports: [
    AuthModule,
    UserModule,
    TodoModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
    LoggerModule.forRootAsync({
      imports: [JwtModule],
      inject: [JwtService],
      useFactory: pinoConfig,
    }),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls: ClsService<ClsStore>, req: FastifyRequest) => {
          cls.set('requestId', req.headers['x-request-id']);
        },
      },
    }),
    TodoModule,
    SharedModule,
  ],
  controllers: [],
  providers: [PrismaProvider],
})
export class AppModule {}
