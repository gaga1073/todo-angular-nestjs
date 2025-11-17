import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ClsModule } from 'nestjs-cls';
import { SampleListener } from '@/features/user/application/event-listeners/sample.listener';
import { UserCommandService } from '@/features/user/application/services/user-command.service';
import { UserQueryService } from '@/features/user/application/services/user-query.service';
import { UserController } from '@/features/user/controllers/user.controller';
import { IUserRepositoryToken } from '@/features/user/domain/repositories/user-repository.interface';
import { EmailDuplicationCheckDomainService } from '@/features/user/domain/services/email-duplication-check-domain.service';
import { UserRepository } from '@/features/user/infrastructures/repositories/user.repository';

@Module({
  imports: [ClsModule, CqrsModule],
  controllers: [UserController],
  providers: [
    UserQueryService,
    UserCommandService,
    EmailDuplicationCheckDomainService,
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
