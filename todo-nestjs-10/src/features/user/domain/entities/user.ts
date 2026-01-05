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
  createAt: Date;
  isActive: boolean;
  isDeleted: boolean;
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
  createAt: Date;
  isActive: boolean;
  isDeleted: boolean;
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

  public get isDeleted(): boolean {
    return this.props.isDeleted;
  }

  public get createAt(): Date {
    return this.props.createAt;
  }

  public get isActive(): boolean {
    return this.props.isActive;
  }

  public static create({ email, name, password, role }: UserCreateArgs): User {
    const userId = UserId.newCreate();
    const isDeleted = false;
    const isActive = true;
    const createAt = new Date();

    const entity = new User(userId, {
      email: Email.create(email),
      name,
      password: HashPassword.create(password),
      role: Role.create(role),
      isDeleted,
      createAt,
      isActive,
    });

    entity.apply(new SampleEvent(entity));

    return entity;
  }

  public static restore({
    id,
    email,
    name,
    password,
    role,
    isActive,
    createAt,
    isDeleted,
  }: UserRestoreArgs): User {
    return new User(UserId.create(id), {
      email: Email.create(email),
      name,
      password: HashPassword.create(password),
      role: Role.create(role),
      isDeleted,
      isActive,
      createAt,
    });
  }

  public update({
    email,
    name,
    password,
    role,
  }: {
    email?: string;
    name?: string;
    password?: string;
    role?: string;
  }): void {
    if (email !== undefined) {
      this.props.email = Email.create(email);
    }

    if (name !== undefined) {
      this.props.name = name;
    }

    if (password !== undefined) {
      this.props.password = HashPassword.create(password);
    }

    if (role !== undefined) {
      this.props.role = Role.create(role);
    }
  }

  public delete(): void {
    this.props.isDeleted = true;
  }

  public activate(): void {
    this.props.isActive = true;
  }

  public deActivate(): void {
    this.props.isActive = false;
  }
}
