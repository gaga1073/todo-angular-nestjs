import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { UserController } from './controllers/user.controller';
import { UserAuthorizationService } from './domain/services/user-authorization.service';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [PrismaProvider],
  exports: [UserService, UserAuthorizationService],
})
export class UserModule {}
