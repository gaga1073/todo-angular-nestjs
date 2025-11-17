export const GROUP_CLASSIFICATION = ['private', 'public'] as const;
export type GroupClassificationType = (typeof GROUP_CLASSIFICATION)[number];

export const WORKSPACE_CLASSIFICATION = ['private', 'public'] as const;
export type WorkspaceClassificationType = (typeof GROUP_CLASSIFICATION)[number];

export const USER_ROLE = ['admin', 'general'] as const;
export type UserRoleType = (typeof USER_ROLE)[number];

export const WORKSPACE_ROLE = ['owner', 'member', 'viwer'];
export type WorkspaceRoleType = (typeof WORKSPACE_ROLE)[number];
