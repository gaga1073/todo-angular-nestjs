import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { CreateUserDomainService } from '@/core/domain/services/create-user-domain.service';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@/features/user/domain/repositories/user-repository.interface';
import { EmailDuplicationCheckDomainService } from '@/features/user/domain/services/email-duplication-check-domain.service';
import { ValidateDeleteUserService } from '@/features/user/domain/services/validate-delete-user.service';
import { PutUserRequest } from '@/features/user/dto/request/put-user.request';
import { PutUserResponse } from '@/features/user/dto/response/put-user.response';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserRoleType } from '@/shared/constants/management.constant';
import { hashPassword } from '@/shared/utils/password.util';

@Injectable()
export class UserCommandService {
  constructor(
    private readonly createUserDomainService: CreateUserDomainService,
    private readonly emailDuplicationCheckDomainService: EmailDuplicationCheckDomainService,
    private readonly validateDeleteUserService: ValidateDeleteUserService,
    private readonly eventPublisher: EventPublisher,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
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

  public async updateUser(
    userId: string,
    putUserRequest: PutUserRequest,
    loginUser: UserDto,
  ): Promise<PutUserResponse> {
    let hashedPassword;

    if (putUserRequest.password !== undefined) {
      hashedPassword = await hashPassword(putUserRequest.password);
    }

    const { user, version } = await this.userRepository.restoreAggregate(userId);

    if (user.role === 'general' && userId !== loginUser.id) {
      throw new ForbiddenException('操作権限がありません');
    }

    user.update({
      email: putUserRequest?.email,
      name: putUserRequest?.username,
      password: hashedPassword,
      role: putUserRequest?.role,
    });

    await this.userRepository.save(user, version);

    const response = plainToInstance(PutUserResponse, user);

    return response;
  }

  public async deleteUser(userId: string, loginUser: UserDto): Promise<void> {
    const { user, version } = await this.userRepository.restoreAggregate(userId);

    if (userId === loginUser.id) {
      throw new BadRequestException('ログイン中のユーザーは削除できません。');
    }

    await this.validateDeleteUserService.execute(user);
    await this.userRepository.save(user, version);

    return;
  }
}
