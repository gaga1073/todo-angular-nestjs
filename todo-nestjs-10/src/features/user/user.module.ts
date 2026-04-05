import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClsModule } from 'nestjs-cls';
import { SampleListener } from '@/features/user/application/event-listeners/sample.listener';
import { UserCommandService } from '@/features/user/application/services/user-command.service';
import { UserQueryService } from '@/features/user/application/services/user-query.service';
import { UserController } from '@/features/user/controllers/user.controller';
import { IUserRepositoryToken } from '@/features/user/domain/repositories/user-repository.interface';
import { AssertEmailNotDuplicatedService } from '@/features/user/domain/services/assert-email-not-duplicated.service';
import { AssertUserCanBeDeletedService } from '@/features/user/domain/services/assert-user-can-be-deleted.service';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';

@Module({
  imports: [ClsModule, CqrsModule],
  controllers: [UserController],
  providers: [
    UserQueryService,
    UserCommandService,
    AssertEmailNotDuplicatedService,
    AssertUserCanBeDeletedService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
    SampleListener,
  ],
  exports: [
    UserQueryService,
    {
      provide: IUserRepositoryToken,
      useClass: UserRepository,
    },
  ],
})
export class UserModule {}
