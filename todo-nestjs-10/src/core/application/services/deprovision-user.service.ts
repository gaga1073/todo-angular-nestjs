import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import {
  IGroupRepositoryToken,
  IGroupRepository,
} from '@/features/group/domain/repositories/group-repository.interface';
import {
  IProjectRepository,
  IProjectRepositoryToken,
} from '@/features/project/domain/repositories/project-repository.interface';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepositoryToken,
  IUserRepository,
} from '@/features/user/domain/repositories/user-repository.interface';

@Injectable()
export class DeprovisionUserService {
  constructor(
    @Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @Inject(IProjectRepositoryToken) private readonly projectRepository: IProjectRepository,
  ) {}

  @Transactional()
  public async execute(user: User, version: number): Promise<void> {
    const privateGroupId = await this.groupRepository.retrievePrivateGroupIdByUserId(user.id);
    const { group, version: versionGroup } =
      await this.groupRepository.restoreAggregate(privateGroupId);

    const privateProject = await this.projectRepository.findPrivateByUserId(user.id);
    const { project, version: versionProject } = await this.projectRepository.restoreAggregate(
      privateProject.id,
    );
    project.delete();
    await this.projectRepository.save(project, versionProject);

    group.delete();
    await this.groupRepository.save(group, versionGroup);

    user.delete();
    await this.userRepository.save(user, version);
  }
}
