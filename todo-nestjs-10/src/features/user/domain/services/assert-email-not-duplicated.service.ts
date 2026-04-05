import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@/features/user/domain/repositories/user-repository.interface';
import { Email } from '@/features/user/domain/value-objects/email.type';

@Injectable()
export class AssertEmailNotDuplicatedService {
  constructor(@Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository) {}

  public async execute(email: Email): Promise<void> {
    const isDuplicated = await this.userRepository.existsActiveGroupByName(email);
    if (isDuplicated) {
      throw new BadRequestException('すでに使用されているメールアドレスです。');
    }
  }
}
