import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from '@nestjs-cls/transactional';
import { Group } from '@/features/group/domain/entities/group';
import {
  IGroupRepositoryToken,
  IGroupRepository,
} from '@/features/group/domain/repositories/group-repository.interface';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepositoryToken,
  IUserRepository,
} from '@/features/user/domain/repositories/user-repository.interface';
import { Workspace } from '@/features/workspace/domain/entities/workspace';
import {
  IWorkspaceRespitoryToken,
  IWorkspaceRespitory,
} from '@/features/workspace/domain/repositories/workspace-repository.interface';

@Injectable()
export class CreateUserDomainService {
  constructor(
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
    @Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository,
    @Inject(IWorkspaceRespitoryToken) private readonly workspaceRepository: IWorkspaceRespitory,
  ) {}

  @Transactional()
  public async execute(user: User): Promise<User> {
    const group = Group.createPrivateGroup({
      userId: user.id,
      username: user.name,
      email: user.email,
    });

    const workspace = Workspace.createPrivateWorkspace({
      username: user.name,
      email: user.email,
      createById: user.id,
      groupId: group.id,
    });

    await this.userRepository.create(user);

    await this.groupRepository.create(group);

    await this.workspaceRepository.create(workspace);

    return user;
  }
}
