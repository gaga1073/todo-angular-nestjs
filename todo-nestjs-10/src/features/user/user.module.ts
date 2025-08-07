import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { UserController } from './controllers/user.controller';
import { UserAuthorizationService } from './domain/services/user-authorization.service';
import { UserRepository } from './infrastructures/repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [
    PrismaProvider,
    UserService,
    UserAuthorizationService,
    UserRepository,
  ],
  exports: [UserService, UserAuthorizationService],
})
export class UserModule {}
