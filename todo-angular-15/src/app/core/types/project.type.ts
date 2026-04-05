// === Base ===
export type ProjectModel = {
  id: string;
  name: string;
  description: string;
  groupId: string;
  createById: string;
  createAt: string;
  updateAt: string;
};

export type ProjectListModel = ProjectModel & {
  group: {
    id: string;
    name: string;
  };
};

// === Response ===
export type ProjectsByUserIdResponse = ProjectModel[];

export type ProjectSearchResponse = {
  items: ProjectListModel[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

export type ProjectPostResponse = ProjectModel;

export type ProjectPatchResponse = ProjectModel;

// === Request ===

export type ProjectGetResponse = ProjectModel;

export type ProjectsGetResponse = ProjectModel[];

export type ProjectSearchRequest = {
  name?: string;
};

export type ProjectPostRequest = {
  name: string;
  description: string;
  groupId: string;
};

export type ProjectPatchRequest = {
  name?: string;
  description?: string;
};
