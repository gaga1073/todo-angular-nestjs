import { Project } from '@/features/project/domain/entities/project';
import { ProjectRepository } from '@/features/project/infrastructures/repositories/project.repository';

export class DeprovisionProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  public async execute(project: Project, version: number): Promise<void> {
    // TODO: TODO削除の実装

    project.delete();
    await this.projectRepository.save(project, version);
  }
}
