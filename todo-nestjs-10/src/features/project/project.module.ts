import { Module } from '@nestjs/common';
import { ProjectCommandService } from '@/features/project/application/services/project-command.service';
import { ProjectQueryService } from '@/features/project/application/services/project-query.service';
import { ProjectController } from '@/features/project/controllers/project.controller';
import { IProjectGroupAccessPortToken } from '@/features/project/domain/ports/project-group-access.port';
import { IProjectRepositoryToken } from '@/features/project/domain/repositories/project-repository.interface';
import { ProjectGroupAccessAdapter } from '@/features/project/infrastructures/adapters/project-group-access.adapter';
import { ProjectRepository } from '@/features/project/infrastructures/repositories/project.repository';

@Module({
  controllers: [ProjectController],
  providers: [
    ProjectQueryService,
    ProjectCommandService,
    {
      provide: IProjectRepositoryToken,
      useClass: ProjectRepository,
    },
    {
      provide: IProjectGroupAccessPortToken,
      useClass: ProjectGroupAccessAdapter,
    },
  ],
  exports: [IProjectRepositoryToken],
})
export class ProjectModule {}
