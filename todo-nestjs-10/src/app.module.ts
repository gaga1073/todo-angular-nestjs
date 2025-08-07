import { IncomingMessage } from 'http';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaProvider } from './core/providers/prisma/prisma.provider';
import { AuthModule } from './features/auth/auth.module';
import { UserModule } from './features/user/user.module';

const pinoConfig = async (jwtService: JwtService) => {
  return {
    pinoHttp: {
      transport: {
        target: 'pino-pretty',
        options: {
          singleLine: true,
          translateTime: true,
          ignore:
            'pid,req.headers,req.remoteAddress,req.remotePort,req.query,res.headers',
        },
      },
      customProps: (req: IncomingMessage) => {
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace(/^Bearer\s/, '');
        let userId: string;

        if (token) {
          const payload = jwtService.decode(token) as { userId: string };
          userId = payload.userId;
        } else {
          userId = '';
        }

        return {
          userId: userId,
        };
      },
    },
  };
};

@Module({
  imports: [
    AuthModule,
    UserModule,
    LoggerModule.forRootAsync({
      imports: [JwtModule],
      inject: [JwtService],
      useFactory: pinoConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, PrismaProvider],
})
export class AppModule {}
