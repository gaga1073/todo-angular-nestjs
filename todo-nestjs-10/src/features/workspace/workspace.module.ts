import { Module } from '@nestjs/common';
import { IWorkspaceRespitoryToken } from '@/features/workspace/domain/repositories/workspace-repository.interface';
import { WorkspaceRespository } from '@/features/workspace/infrastructures/repositories/workspace.respository';

@Module({
  controllers: [],
  providers: [
    {
      provide: IWorkspaceRespitoryToken,
      useClass: WorkspaceRespository,
    },
  ],
  exports: [
    {
      provide: IWorkspaceRespitoryToken,
      useClass: WorkspaceRespository,
    },
  ],
})
export class WorkspaceModule {}
