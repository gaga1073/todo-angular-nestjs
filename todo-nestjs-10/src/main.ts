import { IncomingMessage } from 'http';
import fastifyCookie from '@fastify/cookie';
import { Logger as defaultLogger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ulid } from 'ulid';
import { AppModule } from './app.module';
import { ExceptionsFilter } from './core/filters/exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      genReqId: (req: IncomingMessage) => {
        const existingId = req.headers['x-request-id'] as string | undefined;
        if (existingId) return existingId;
        const id = ulid();
        return id;
      },
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
  });

  new defaultLogger().log(`access port: ${process.env.PORT ?? 3000}`);

  app.useLogger(app.get(Logger));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapter));

  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.register(fastifyCookie, { secret: 'MY_SUPER_SECRET_COOKIE' });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
