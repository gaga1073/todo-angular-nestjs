import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepositoryToken,
  IUserRepository,
} from '@/features/user/domain/repositories/user-repository.interface';

@Injectable()
export class ValidateDeleteUserService {
  constructor(@Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository) {}

  public async execute(user: User): Promise<void> {
    const userModel = await this.userRepository.findById(user.id);

    if (userModel.isDeleted === true) {
      throw new BadRequestException('対象ユーザーはすでに削除されています。');
    }
  }
}
