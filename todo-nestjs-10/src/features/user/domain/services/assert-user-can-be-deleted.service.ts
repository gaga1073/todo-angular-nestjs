import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepositoryToken,
  IUserRepository,
} from '@/features/user/domain/repositories/user-repository.interface';

@Injectable()
export class AssertUserCanBeDeletedService {
  constructor(@Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository) {}

  public async execute(user: User): Promise<void> {
    const isDeleted = await this.userRepository.existsDeletedUser(user.id);

    if (isDeleted) {
      throw new NotFoundException('対象ユーザーはすでに削除されています。');
    }
  }
}
