import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user';

@Injectable()
export class UserAuthorizationService {
  public async comparePassword(password: string, user: User): Promise<boolean> {
    try {
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UnauthorizedException('Incorrect Username or Password');
      }

      return match;
    } catch (error) {
      throw error;
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
