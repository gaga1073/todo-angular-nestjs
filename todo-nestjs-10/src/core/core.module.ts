import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { AppLoggerFactory } from './providers/app-logger.factory';
import { PrismaProvider } from './providers/prisma.provider';

@Global()
@Module({
  imports: [ClsModule],
  providers: [AppLoggerFactory, PrismaProvider],
  exports: [AppLoggerFactory, PrismaProvider],
})
export class CoreModule {}
