import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { GroupController } from '@/features/group/controllers/group.controller';
import { IGroupRepositoryToken } from '@/features/group/domain/repositories/group-repository.interface';
import { GroupRepository } from '@/features/group/infrastructures/repositories/group.repository';
import { GroupQueryService } from '@/features/group/services/group-query.service';

@Module({
  imports: [ClsModule],
  controllers: [GroupController],
  providers: [
    GroupQueryService,
    {
      provide: IGroupRepositoryToken,
      useClass: GroupRepository,
    },
  ],
  exports: [
    {
      provide: IGroupRepositoryToken,
      useClass: GroupRepository,
    },
  ],
})
export class GroupModule {}
