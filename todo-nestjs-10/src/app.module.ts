import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ClsModule, ClsService, ClsStore } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { CoreModule } from '@/core/core.module';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { AuthModule } from '@/features/auth/auth.module';
import { TodoModule } from '@/features/todo/todo.module';
import { UserModule } from '@/features/user/user.module';
import { getEnvFilePath, pinoConfig } from '@/shared/utils/config.util';

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
  ],
  controllers: [],
  providers: [PrismaProvider],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(RequestIDMiddleware).forRoutes('*');
  // }
}
