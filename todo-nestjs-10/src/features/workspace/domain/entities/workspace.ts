import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { GroupWorkspaceAccess } from '@/features/group/domain/value-objects/group-workspace-access.type';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';
import { WorkspaceClassification } from '@/features/workspace/domain/value-objects/workspace-classification.type';
import { WorkspaceId } from '@/features/workspace/domain/value-objects/workspace-id.type';
import { Entity } from '@/shared/base-class/domain/entity';
import {
  WorkspaceClassificationType,
  WorkspaceRoleType,
} from '@/shared/constants/management.constant';

type WorkspaceProps = {
  name: string;
  description: string;
  createById: UserId;
  workspaceClassification: WorkspaceClassification;
  groupWorkspaceAccess: GroupWorkspaceAccess[];
};

type WorkspaceArgs = {
  name: string;
  description: string;
  createById: string;
  workspaceClassification: WorkspaceClassificationType;
  groupWorkspaceAccess: { groupId: string; workspaceRole: WorkspaceRoleType }[];
};

export class Workspace extends Entity<WorkspaceId, WorkspaceProps> {
  private constructor(id: WorkspaceId, props: WorkspaceProps) {
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
  public get workspaceClassification(): WorkspaceClassificationType {
    return this.props.workspaceClassification;
  }
  public get groupWorkspaceAccess(): GroupWorkspaceAccess[] {
    return this.props.groupWorkspaceAccess;
  }

  public static createPrivateWorkspace({
    username,
    email,
    createById,
    groupId,
  }: {
    username: string;
    email: string;
    createById: UserId;
    groupId: GroupId;
  }): Workspace {
    return new Workspace(WorkspaceId.newCreate(), {
      name: `${username} «${email}»`,
      description: '',
      createById: UserId.create(createById),
      workspaceClassification: WorkspaceClassification.create('private'),
      groupWorkspaceAccess: [GroupWorkspaceAccess.create({ groupId, workspaceRole: 'owner' })],
    });
  }

  public static restore({
    id,
    name,
    description,
    createById,
    workspaceClassification,
    groupWorkspaceAccess,
  }: { id: WorkspaceId } & WorkspaceArgs): Workspace {
    return new Workspace(WorkspaceId.create(id), {
      name,
      description,
      createById: UserId.create(createById),
      workspaceClassification: WorkspaceClassification.create(workspaceClassification),
      groupWorkspaceAccess: groupWorkspaceAccess.map((value) => GroupWorkspaceAccess.create(value)),
    });
  }
}
