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

  public toPlainObject(): { id: string } & Omit<UserPorps, 'password'> {
    return {
      id: this._id.toString(),
      email: this.email,
      username: this.username,
    };
  }
}
