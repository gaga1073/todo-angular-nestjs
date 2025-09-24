import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { ClsModule, ClsService, ClsStore } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from '@/auth/auth.module';
import { CoreModule } from '@/core/core.module';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { getEnvFilePath, pinoConfig } from '@/core/utils/config.util';
import { UserModule } from '@/user-management/user.module';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';

const envFilePath = getEnvFilePath(`${__dirname}`);

@Module({
  imports: [
    AuthModule,
    UserModule,
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
  ],
  controllers: [AppController],
  providers: [AppService, PrismaProvider],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer): void {
  //   consumer.apply(RequestIDMiddleware).forRoutes('*');
  // }
}
