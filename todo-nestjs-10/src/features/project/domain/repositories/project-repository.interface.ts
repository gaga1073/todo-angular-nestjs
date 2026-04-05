import { ProjectModel } from '@prisma/client';
import { Project } from '@/features/project/domain/entities/project';

export const IProjectRepositoryToken = Symbol('IProjectRepository');

export interface IProjectRepository {
  create(project: Project): Promise<void>;
  save(project: Project, version: number): Promise<void>;
  findPrivateByUserId(userId: string): Promise<ProjectModel>;
  restoreAggregate(ProjectId: string): Promise<{ project: Project; version: number }>;
}
