import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@/features/user/domain/repositories/user-repository.interface';
import { Email } from '@/features/user/domain/value-objects/email.type';

@Injectable()
export class EmailDuplicationCheckDomainService {
  constructor(@Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository) {}

  public async execute(email: Email): Promise<void> {
    const result = this.userRepository.findActiveUserByEmail(email);
    if (result === null) {
      throw new BadRequestException('Incorrect email');
    }
  }
}
