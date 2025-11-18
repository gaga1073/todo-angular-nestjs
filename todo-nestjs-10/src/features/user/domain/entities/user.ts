import { Entity } from '@/core/domain/base-classes/entity';
import { SampleEvent } from '@/features/user/domain/events/sample.envet';
import { Email } from '@/features/user/domain/value-objects/email.type';
import { HashPassword } from '@/features/user/domain/value-objects/hash-password.type';
import { Role } from '@/features/user/domain/value-objects/role.type';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';
import { UserRoleType } from '@/shared/constants/management.constant';

type UserProps = {
  email: Email;
  name: string;
  password: HashPassword;
  role: Role;
  isDelete: boolean;
};

type UserCreateArgs = {
  email: string;
  name: string;
  password: string;
  role: UserRoleType;
};

type UserRestoreArgs = {
  id: string;
  email: string;
  name: string;
  password: string;
  role: UserRoleType;
  isDelete: boolean;
};

export class User extends Entity<UserId, UserProps> {
  private constructor(id: UserId, props: UserProps) {
    super(id, props);
  }

  public get email(): Email {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): Role {
    return this.props.role;
  }

  public get password(): HashPassword {
    return this.props.password;
  }

  public get isDelete(): boolean {
    return this.props.isDelete;
  }

  public static create({ email, name, password, role }: UserCreateArgs): User {
    const userId = UserId.newCreate();
    const isDelete = false;

    const entity = new User(userId, {
      email: Email.create(email),
      name,
      password: HashPassword.create(password),
      role: Role.create(role),
      isDelete,
    });

    entity.apply(new SampleEvent(entity));

    return entity;
  }

  public static restore({ id, email, name, password, role, isDelete }: UserRestoreArgs): User {
    return new User(UserId.create(id), {
      email: Email.create(email),
      name,
      password: HashPassword.create(password),
      role: Role.create(role),
      isDelete,
    });
  }
}
