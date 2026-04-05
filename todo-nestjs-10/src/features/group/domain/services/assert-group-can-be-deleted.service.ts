import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Group } from '@/features/group/domain/entities/group';
import {
  IGroupRepositoryToken,
  IGroupRepository,
} from '@/features/group/domain/repositories/group-repository.interface';

@Injectable()
export class AssertGroupCanBeDeletedService {
  constructor(@Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository) {}

  public async execute(group: Group): Promise<void> {
    const isDeleted = await this.groupRepository.existsDeletedGroup(group.id);

    if (isDeleted) {
      throw new NotFoundException('対象グループはすでに削除されています。');
    }
  }
}
