import { ForbiddenException } from '@nestjs/common';
import { Entity } from '@/core/domain/base-classes/entity';
import { GroupClassification } from '@/features/group/domain/value-objects/group-classification.type';
import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { GroupMembership } from '@/features/group/domain/value-objects/group-member.type';

type GroupProps = {
  name: string;
  description: string;
  groupClassification: GroupClassification;
  isDeleted: boolean;
  updateAt: Date;
  createAt: Date;
  groupMembers: GroupMembership[];
};

type GroupCreateArgs = {
  name: string;
  description: string;
  groupClassification?: string;
  groupMembers?: string[];
};

type GroupRestoreArgs = {
  name: string;
  description: string;
  isDeleted: boolean;
  groupClassification: string;
  updateAt: Date;
  createAt: Date;
  groupMembers: string[];
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
  public get updateAt(): Date {
    return this.props.updateAt;
  }
  public get isDeleted(): boolean {
    return this.props.isDeleted;
  }
  public get createAt(): Date {
    return this.props.createAt;
  }
  public get groupMembers(): GroupMembership[] {
    return this.props.groupMembers;
  }

  public static createPublicGroup({ name, description, groupMembers }: GroupCreateArgs): Group {
    return new Group(GroupId.newCreate(), {
      name,
      description,
      isDeleted: false,
      groupClassification: GroupClassification.create('public'),
      updateAt: new Date(),
      createAt: new Date(),
      groupMembers: groupMembers ? groupMembers?.map((value) => GroupMembership.create(value)) : [],
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
      isDeleted: false,
      groupClassification: GroupClassification.create('private'),
      updateAt: new Date(),
      createAt: new Date(),
      groupMembers: [GroupMembership.create(userId)],
    });
  }

  public static restore({
    id,
    name,
    description,
    groupClassification,
    isDeleted,
    updateAt,
    createAt,
    groupMembers,
  }: { id: string } & GroupRestoreArgs): Group {
    return new Group(GroupId.create(id), {
      name,
      description,
      isDeleted,
      groupClassification: GroupClassification.create(groupClassification),
      updateAt,
      createAt,
      groupMembers: groupMembers?.map((value) => GroupMembership.create(value)),
    });
  }

  public update({
    name,
    description,
    groupMembers,
  }: {
    name?: string;
    description?: string;
    groupMembers?: string[];
  }): void {
    if (this.props.isDeleted === true) {
      throw new ForbiddenException('対象グループが削除済です。');
    }

    if (name !== undefined) {
      this.props.name = name;
    }
    if (description !== undefined) {
      this.props.description = description;
    }
    if (groupMembers !== undefined) {
      this.props.groupMembers = groupMembers.map((v) => GroupMembership.create(v));
    }

    this.props.updateAt = new Date();
  }

  public delete(): void {
    this.props.isDeleted = true;
    this.props.updateAt = new Date();
  }
}
