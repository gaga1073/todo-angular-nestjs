import { Workspace } from '@/features/workspace/domain/entities/workspace';

export const IWorkspaceRespitoryToken = Symbol('IWorkspaceRespitory');

export interface IWorkspaceRespitory {
  create(workspace: Workspace): Promise<void>;
}
