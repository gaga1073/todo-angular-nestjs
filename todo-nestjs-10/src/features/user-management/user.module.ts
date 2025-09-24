import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { AppLoggerFactory } from '@/core/providers/app-logger.factory';
import { UserController } from '@/user-management/controllers/user.controller';
import { UserDomainService } from '@/user-management/domain/services/user-domain.service';
import { UserRepository } from '@/user-management/infrastructures/repositories/user.repository';
import { UserCommandService } from '@/user-management/services/user-command.service';
import { UserQueryService } from '@/user-management/services/user-query.service';

@Module({
  imports: [ClsModule],
  controllers: [UserController],
  providers: [
    UserQueryService,
    UserCommandService,
    AppLoggerFactory,
    UserDomainService,
    // {
    //   provide: IUserRepositoryToken,
    //   useClass: UserRepository,
    // },
    UserRepository,
  ],
  exports: [UserQueryService, UserCommandService, UserDomainService],
})
export class UserModule {}
