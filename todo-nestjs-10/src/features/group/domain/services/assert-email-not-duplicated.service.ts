import { BadRequestException, Inject } from '@nestjs/common';
import {
  IGroupRepositoryToken,
  IGroupRepository,
} from '@/features/group/domain/repositories/group-repository.interface';

export class AssertGroupNameNotDuplicatedService {
  constructor(@Inject(IGroupRepositoryToken) private readonly groupRepository: IGroupRepository) {}

  public async execute(name: string): Promise<void> {
    const isDuplicated = await this.groupRepository.existsActiveGroupByName(name);
    if (isDuplicated) throw new BadRequestException('すでに使用されているグループ名です。');
  }
}
