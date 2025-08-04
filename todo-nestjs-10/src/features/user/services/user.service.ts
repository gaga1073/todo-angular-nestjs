import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const user = await this.userRepository.findOneByEmail(email);

      if (user === null) {
        throw new NotFoundException('Not Found User');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Unexpected error in findUserByEmailOrFail:', error);
      throw new InternalServerErrorException('DataBase Error');
    }
  }

  public async create(signupRequest: SignupRequest): Promise<User> {
    const hashedPassword = await this.userAuthorizationService.hashPassword(
      signupRequest.password,
    );

    try {
      const user = User.create({
        email: signupRequest.email,
        username: signupRequest.username,
        password: hashedPassword,
      });

      this.userRepository.create(user);

      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
