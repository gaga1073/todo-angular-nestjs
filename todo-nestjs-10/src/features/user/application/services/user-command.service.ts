import { Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';
import { CreateUserDomainService } from '@/core/domain/services/create-user-domain.service';
import { hashPassword } from '@/shared/utils/password.util';
import { User } from '@/features/user/domain/entities/user';
import { EmailDuplicationCheckDomainService } from '@/features/user/domain/services/email-duplication-check-domain.service';
import { UserDto } from '@/features/user/dto/response/user.dto';

@Injectable()
export class UserCommandService {
  constructor(
    private readonly createUserDomainService: CreateUserDomainService,
    private readonly emailDuplicationCheckDomainService: EmailDuplicationCheckDomainService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  public async createUser({
    username,
    email,
    role,
    password,
  }: {
    username: string;
    email: string;
    role: UserRoleType;
    password: string;
  }): Promise<UserDto> {
    const hashedPassword = await hashPassword(password);

    const user = User.create({
      email: email,
      name: username,
      password: hashedPassword,
      role: role,
    });

    await this.emailDuplicationCheckDomainService.execute(user.email);

    await this.createUserDomainService.execute(user);

    const userContext = this.eventPublisher.mergeObjectContext(user);
    userContext.commit();

    const response = plainToInstance(UserDto, user);

    return response;
  }
}
