import { Entity } from '@/core/base-class/domain/entity';
import { Ulid } from '@/core/base-class/domain/ulid';
import { GroupMember } from '@/user-management/domain/value-objects/group-member.type';

type GroupProps = {
  name: string;
  description: string;
  members?: GroupMember[];
  workspaces: Ulid[];
};

export class Group extends Entity<Ulid, GroupProps> {
  private constructor(id: Ulid, props: GroupProps) {
    super(id, props);
  }

  public get name(): string {
    return this.props.name;
  }
  public get description(): string {
    return this.props.description;
  }
  public get getmembers(): GroupMember[] | undefined {
    return this.props.members;
  }

  public get workspaces(): Ulid[] {
    return this.props.workspaces;
  }

  public static craete({
    name,
    description,
    members,
    workspaces,
  }: {
    name: string;
    description: string;
    members: GroupMember[];
    workspaces: Ulid[];
  }): Group {
    return new Group(new Ulid(), {
      name,
      description,
      members,
      workspaces,
    });
  }

  public static restore({
    id,
    name,
    description,
    members,
    workspaces,
  }: {
    id: Ulid;
    name: string;
    description: string;
    members: GroupMember[];
    workspaces: Ulid[];
  }): Group {
    return new Group(id, { name, description, members, workspaces });
  }
}
