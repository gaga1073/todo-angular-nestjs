import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Group } from '@/features/group/domain/entities/group';
import {
  IGroupRepositoryToken,
  IGroupRepository,
} from '@/features/group/domain/repositories/group-repository.interface';
import { Project } from '@/features/project/domain/entities/project';
import {
  IProjectRepositoryToken,
  IProjectRepository,
} from '@/features/project/domain/repositories/project-repository.interface';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepositoryToken,
  IUserRepository,
} from '@/features/user/domain/repositories/user-repository.interface';

@Injectable()
export class ProvisionUserService {
  constructor(
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository,
    @Inject(IProjectRepositoryToken) private readonly projectRepository: IProjectRepository,
  ) {}

  @Transactional()
  public async execute(user: User): Promise<User> {
    const group = Group.createPrivateGroup({
      userId: user.id,
      username: user.name,
      email: user.email,
    });

    const project = Project.createPrivateProject({
      username: user.name,
      email: user.email,
      createById: user.id,
      groupId: group.id,
    });

    await this.userRepository.create(user);

    await this.groupRepository.create(group);

    await this.projectRepository.create(project);

    return user;
  }
}
