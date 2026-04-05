import { Entity } from '@/core/domain/base-classes/entity';
import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { ProjectId } from '@/features/project/domain/value-objects/project-id.type';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';

type ProjectProps = {
  name: string;
  description: string;
  createById: UserId;
  groupId: GroupId;
  isDeleted: boolean;
  updateAt: Date;
  createAt: Date;
};

type ProjectCreateArgs = {
  name: string;
  description: string;
  groupId: GroupId;
  createById: string;
};

type ProjectRestoreArgs = {
  name: string;
  description: string;
  createById: string;
  groupId: GroupId;
  isDeleted: boolean;
  updateAt: Date;
  createAt: Date;
};

export class Project extends Entity<ProjectId, ProjectProps> {
  private constructor(id: ProjectId, props: ProjectProps) {
    super(id, props);
  }
  public get name(): string {
    return this.props.name;
  }
  public get description(): string {
    return this.props.description;
  }
  public get createById(): UserId {
    return this.props.createById;
  }
  public get groupId(): GroupId {
    return this.props.groupId;
  }
  public get isDeleted(): boolean {
    return this.props.isDeleted;
  }
  public get updateAt(): Date {
    return this.props.updateAt;
  }
  public get createAt(): Date {
    return this.props.createAt;
  }

  public static createPublicProject({
    name,
    description,
    createById,
    groupId,
  }: ProjectCreateArgs): Project {
    return new Project(ProjectId.newCreate(), {
      name: name,
      description: description,
      createById: UserId.create(createById),
      groupId: groupId,
      isDeleted: false,
      updateAt: new Date(),
      createAt: new Date(),
    });
  }

  public static createPrivateProject({
    username,
    email,
    createById,
    groupId,
  }: {
    username: string;
    email: string;
    createById: UserId;
    groupId: GroupId;
  }): Project {
    return new Project(ProjectId.newCreate(), {
      name: `${username} «${email}»`,
      description: '',
      createById: UserId.create(createById),
      groupId: groupId,
      isDeleted: false,
      updateAt: new Date(),
      createAt: new Date(),
    });
  }

  public static restore({
    id,
    name,
    description,
    createById,
    groupId,
    isDeleted,
    updateAt,
    createAt,
  }: { id: string } & ProjectRestoreArgs): Project {
    return new Project(ProjectId.create(id), {
      name,
      description,
      createById: UserId.create(createById),
      groupId: groupId,
      isDeleted,
      updateAt,
      createAt,
    });
  }

  public delete(): void {
    this.props.isDeleted = true;
  }

  update(args: { name?: string; description?: string }): void {
    if (args.name !== undefined) {
      this.props.name = args.name;
    }
    if (args.description !== undefined) {
      this.props.description = args.description;
    }
    this.props.updateAt = new Date();
  }
}
