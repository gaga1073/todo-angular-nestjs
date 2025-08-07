import { Injectable, NotFoundException } from '@nestjs/common';
import { SignupRequest } from 'src/features/auth/dto/signup.request';
import { User } from '../domain/entities/user';
import { UserAuthorizationService } from '../domain/services/user-authorization.service';
import { UserRepository } from '../infrastructures/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userAuthorizationService: UserAuthorizationService,
  ) {}

  public async findUserByEmailOrFail(email: string): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email);

    if (user === null) {
      throw new NotFoundException('Not Found User');
    }

    return user;
  }

  public async createUser(signupRequest: SignupRequest): Promise<User> {
    const hashedPassword = await this.userAuthorizationService.hashPassword(
      signupRequest.password,
    );
    const user = User.create({
      email: signupRequest.email,
      username: signupRequest.username,
      password: hashedPassword,
    });

    await this.userRepository.create(user);

    return user;
  }
}
