import { Entity } from '@/core/base-class/domain/entity';
import { Ulid } from '@/core/base-class/domain/ulid';
import { PersonalWorkspace } from '@/user-management/domain/entities/personal-workspace';
import { Role } from '@/user-management/domain/value-objects/role.type';

type UserProps = {
  email: string;
  name: string;
  password: string;
  role: Role;
  isDelete: boolean;
  personalWorkspace: PersonalWorkspace;
};

export class User extends Entity<Ulid, UserProps> {
  private constructor(id: Ulid, props: UserProps) {
    super(id, props);
  }

  public get email(): string {
    return this.props.email;
  }

  public get name(): string {
    return this.props.name;
  }

  public get role(): Role {
    return this.props.role;
  }

  public get password(): string {
    return this.props.password;
  }

  public get isDelete(): boolean {
    return this.props.isDelete;
  }

  public static create({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }): User {
    const userId = new Ulid();
    const role = 'member';
    const isDelete = false;
    const personalWorkspace = PersonalWorkspace.create({ username: name, ownerId: userId });
    return new User(userId, { email, name, password, role, isDelete, personalWorkspace });
  }

  public static restore({
    id,
    email,
    name,
    password,
    role,
    isDelete,
    personalWorkspace,
  }: {
    id: Ulid;
    email: string;
    name: string;
    password: string;
    role: Role;
    isDelete: boolean;
    personalWorkspace: PersonalWorkspace;
  }): User {
    return new User(id, { email, name, password, role, isDelete, personalWorkspace });
  }
}
