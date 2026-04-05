import { Inject } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Group } from '@/features/group/domain/entities/group';
import {
  IGroupRepository,
  IGroupRepositoryToken,
} from '@/features/group/domain/repositories/group-repository.interface';
import { AssertGroupNameNotDuplicatedService } from '@/features/group/domain/services/assert-email-not-duplicated.service';
import { AssertGroupCanBeDeletedService } from '@/features/group/domain/services/assert-group-can-be-deleted.service';
import { PatchGroupRequest } from '@/features/group/dto/request/patch-group.request';
import { PostGroupRequest } from '@/features/group/dto/request/post-group.request';
import { PatchGroupResponse } from '@/features/group/dto/response/patch-group.response';
import { PostGroupResponse } from '@/features/group/dto/response/post-group.response';

export class GroupCommandService {
  constructor(
    private readonly assertGroupNameNotDuplicatedService: AssertGroupNameNotDuplicatedService,
    private readonly assertGroupCanBeDeletedService: AssertGroupCanBeDeletedService,
    @Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository,
  ) {}

  public async createGroup(request: PostGroupRequest): Promise<PostGroupResponse> {
    const group = Group.createPublicGroup({
      name: request.name,
      description: request.description,
      groupMembers: request.userIds,
    });

    await this.assertGroupNameNotDuplicatedService.execute(group.name);

    await this.groupRepository.create(group);

    return plainToInstance(PostGroupResponse, {
      id: group.id,
      name: group.name,
      description: group.description,
      createAt: group.createAt,
      updateAt: group.updateAt,
      userIds: group.groupMembers,
    });
  }

  public async updateGroup(
    groupId: string,
    request: PatchGroupRequest,
  ): Promise<PatchGroupResponse> {
    const { group, version } = await this.groupRepository.restoreAggregate(groupId);

    group.update({
      name: request.name,
      description: request.description,
      groupMembers: request.userIds,
    });

    await this.groupRepository.save(group, version);

    return plainToInstance(PatchGroupResponse, {
      id: group.id,
      name: group.name,
      description: group.description,
      createAt: group.createAt,
      updateAt: group.updateAt,
      userIds: group.groupMembers,
    });
  }

  public async deleteGroup(groupId: string): Promise<void> {
    const { group, version } = await this.groupRepository.restoreAggregate(groupId);

    await this.assertGroupCanBeDeletedService.execute(group);

    group.delete();

    await this.groupRepository.save(group, version);
  }
}
