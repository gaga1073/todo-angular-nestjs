import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../domain/entities/user';
import {
  IUserRepository,
  IUserRepositoryToken,
} from '../domain/repositories/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(IUserRepositoryToken)
    private readonly userRepository: IUserRepository,
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
}
