import { GroupClassification } from '@/features/group/domain/value-objects/group-classification.type';
import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { GroupMembership } from '@/features/group/domain/value-objects/group-member.type';
import { Entity } from '@/shared/base-class/domain/entity';

type GroupProps = {
  name: string;
  description: string;
  groupClassification: GroupClassification;
  groupMembers?: GroupMembership[];
};

type GroupCreateArgs = {
  name: string;
  description: string;
  groupClassification?: string;
  groupMembers?: string[];
};

type GroupRestroeArgs = {
  name: string;
  description: string;
  groupClassification: string;
  groupMembers?: string[];
};

export class Group extends Entity<GroupId, GroupProps> {
  private constructor(id: GroupId, props: GroupProps) {
    super(id, props);
  }

  public get name(): string {
    return this.props.name;
  }
  public get description(): string {
    return this.props.description;
  }
  public get groupClassification(): GroupClassification {
    return this.props.groupClassification;
  }
  public get groupMembers(): GroupMembership[] | undefined {
    return this.props.groupMembers;
  }

  public static craetePublicGroup({ name, description, groupMembers }: GroupCreateArgs): Group {
    return new Group(GroupId.newCreate(), {
      name,
      description,
      groupMembers: groupMembers?.map((value) => GroupMembership.create(value)),
      groupClassification: GroupClassification.create('public'),
    });
  }

  public static createPrivateGroup({
    userId,
    username,
    email,
  }: {
    userId: string;
    username: string;
    email: string;
  }): Group {
    return new Group(GroupId.newCreate(), {
      name: `${username} «${email}»`,
      description: 'This is a private group',
      groupClassification: GroupClassification.create('private'),
      groupMembers: [GroupMembership.create(userId)],
    });
  }

  public static restore({
    id,
    name,
    description,
    groupClassification,
    groupMembers,
  }: { id: string } & GroupRestroeArgs): Group {
    return new Group(GroupId.create(id), {
      name,
      description,
      groupClassification: GroupClassification.create(groupClassification),
      groupMembers: groupMembers?.map((value) => GroupMembership.create(value)),
    });
  }
}
