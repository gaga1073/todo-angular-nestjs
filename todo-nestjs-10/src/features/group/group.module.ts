import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { GroupController } from '@/features/group/controllers/group.controller';
import { IGroupRepositoryToken } from '@/features/group/domain/repositories/group-repository.interface';
import { AssertGroupNameNotDuplicatedService } from '@/features/group/domain/services/assert-email-not-duplicated.service';
import { AssertGroupCanBeDeletedService } from '@/features/group/domain/services/assert-group-can-be-deleted.service';
import { GroupRepository } from '@/features/group/infrastructures/repositories/group.repository';
import { GroupCommandService } from '@/features/group/services/group-command.service';
import { GroupQueryService } from '@/features/group/services/group-query.service';

@Module({
  imports: [ClsModule],
  controllers: [GroupController],
  providers: [
    GroupQueryService,
    GroupCommandService,
    AssertGroupNameNotDuplicatedService,
    AssertGroupCanBeDeletedService,
    {
      provide: IGroupRepositoryToken,
      useClass: GroupRepository,
    },
  ],
  exports: [IGroupRepositoryToken],
})
export class GroupModule {}
