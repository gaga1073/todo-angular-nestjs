import { UnauthorizedException } from '@nestjs/common';
import { Entity } from 'src/core/base-class/domain/entity';
import { UserId } from '../value-objects/user-id';

type UserPorps = {
  email: string;
  username: string;
  password: string;
};

export class User extends Entity<UserId, UserPorps> {
  private constructor(id: UserId, props: UserPorps) {
    super(id, props);
  }

  public get email(): string {
    return this.props.email;
  }

  public get username(): string {
    return this.props.username;
  }

  public get password(): string {
    return this.props.password;
  }

  public static create({
    email,
    username,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }): User {
    return new User(new UserId(), { email, username, password });
  }

  public static restore({
    id,
    email,
    username,
    password,
  }: {
    id: UserId;
    email: string;
    username: string;
    password: string;
  }): User {
    return new User(id, { email, username, password });
  }

  public async comparePassword(password: string, user: User): Promise<boolean> {
    try {
      // const match = await bcrypt.compare(password, user.password);
      const match = password === user.password;

      if (!match) {
        throw new UnauthorizedException('Incorrect Username or Password');
      }

      return match;
    } catch (error) {
      throw error;
    }
  }

  public toPlainObject(): unknown {
    return {
      id: this._id.toString(),
      email: this.email,
      username: this.username,
      password: this.password,
    };
  }
}
