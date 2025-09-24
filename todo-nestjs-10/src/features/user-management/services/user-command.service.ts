import { Injectable } from '@nestjs/common';
import { SignupRequest } from '@/auth/dto/signup.request';
import { PrismaProvider } from '@/core/providers/prisma.provider';
import { User } from '@/user-management/domain/entities/user';
import { UserDomainService } from '@/user-management/domain/services/user-domain.service';
import { UserDto } from '@/user-management/dto/user.dto';
import { UserRepository } from '@/user-management/infrastructures/repositories/user.repository';

@Injectable()
export class UserCommandService {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly UserDomainService: UserDomainService,
    private readonly userRepository: UserRepository,
  ) {}

  public async createUser(signupRequest: SignupRequest): Promise<UserDto> {
    const hashedPassword = await this.UserDomainService.hashPassword(signupRequest.password);
    const user = User.create({
      email: signupRequest.email,
      name: signupRequest.username,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
