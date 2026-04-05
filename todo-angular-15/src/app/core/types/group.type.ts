// === Base ===
export type GroupModel = {
  id: string;
  name: string;
  description: string;
  createAt: string;
  updateAt: string;
};

export type GroupListModel = GroupModel & {
  users: {
    id: string;
    name: string;
  }[];
};

// === Response ===
export type GroupsByUserIdResponse = GroupModel[];

export type GroupSearchResponse = {
  items: GroupListModel[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

export type GroupPostResponse = GroupModel;

export type GroupPatchResponse = GroupModel;

// === Request ===

export type GroupGetResponse = GroupModel;

export type GroupsGetResponse = GroupListModel[];

export type GroupSearchRequest = {
  name?: string;
};

export type GroupPostRequest = {
  name: string;
  description: string;
  userIds: string[];
};

export type GroupPatchRequest = {
  name?: string;
  description?: string;
  userIds?: string[];
};
