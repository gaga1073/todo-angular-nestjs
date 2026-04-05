import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { plainToInstance } from 'class-transformer';
import { DeprovisionUserService } from '@/core/application/services/deprovision-user.service';
import { ProvisionUserService } from '@/core/application/services/provision-user.service';
import { User } from '@/features/user/domain/entities/user';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '@/features/user/domain/repositories/user-repository.interface';
import { AssertEmailNotDuplicatedService } from '@/features/user/domain/services/assert-email-not-duplicated.service';
import { AssertUserCanBeDeletedService } from '@/features/user/domain/services/assert-user-can-be-deleted.service';
import { PatchUserRequest } from '@/features/user/dto/request/patch-user.request';
import { PatchUserResponse } from '@/features/user/dto/response/patch-user.response';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { UserRoleType } from '@/shared/constants/management.constant';
import { hashPassword } from '@/shared/utils/password.util';

@Injectable()
export class UserCommandService {
  constructor(
    private readonly provisionUserService: ProvisionUserService,
    private readonly assertEmailNotDuplicatedService: AssertEmailNotDuplicatedService,
    private readonly assertUserCanBeDeletedService: AssertUserCanBeDeletedService,
    private readonly deprovisionUserService: DeprovisionUserService,
    private readonly eventPublisher: EventPublisher,
    @Inject(IUserRepositoryToken) private readonly userRepository: IUserRepository,
  ) {}

  public async createUser({
    name,
    email,
    role,
    password,
  }: {
    name: string;
    email: string;
    role: UserRoleType;
    password: string;
  }): Promise<UserDto> {
    const hashedPassword = await hashPassword(password);

    const user = User.create({
      email: email,
      name: name,
      password: hashedPassword,
      role: role,
    });

    await this.assertEmailNotDuplicatedService.execute(user.email);

    await this.provisionUserService.execute(user);

    const userContext = this.eventPublisher.mergeObjectContext(user);
    userContext.commit();

    const response = plainToInstance(UserDto, user);

    return response;
  }

  public async updateUser(
    userId: string,
    patchUserRequest: PatchUserRequest,
    loginUser: UserDto,
  ): Promise<PatchUserResponse> {
    let hashedPassword;

    if (patchUserRequest.password !== undefined) {
      hashedPassword = await hashPassword(patchUserRequest.password);
    }

    const { user, version } = await this.userRepository.restoreAggregate(userId);

    if (user.role === 'general' && userId !== loginUser.id) {
      throw new ForbiddenException('操作権限がありません');
    }

    user.update({
      email: patchUserRequest.email,
      name: patchUserRequest.name,
      password: hashedPassword,
      role: patchUserRequest.role,
    });

    await this.userRepository.save(user, version);

    const response = plainToInstance(PatchUserResponse, user);

    return response;
  }

  public async deleteUser(userId: string, loginUser: UserDto): Promise<string> {
    const { user, version } = await this.userRepository.restoreAggregate(userId);

    if (userId === loginUser.id) {
      throw new ForbiddenException('ログイン中のユーザーは削除できません。');
    }

    await this.assertUserCanBeDeletedService.execute(user);
    await this.deprovisionUserService.execute(user, version);

    return user.id;
  }
}
