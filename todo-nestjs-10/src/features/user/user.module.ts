import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/core/providers/prisma/prisma.provider';
import { UserController } from './controllers/user.controller';
import { IUserRepositoryToken } from './domain/repositories/user-repository.interface';
import { UserRepository } from './infrastructures/repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
    PrismaProvider,
  ],
  exports: [UserService],
})
export class UserModule {}
