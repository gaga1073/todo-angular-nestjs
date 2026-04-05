// === Base ===
export type UserRole = 'admin' | 'general';

export type GroupClassification = 'public' | 'private';

export type UserModel = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createAt: string;
  updateAt: string;
};

export type UserListModel = UserModel & {
  groups: {
    id: string;
    name: string;
    groupClassification: string;
  }[];
};

// === Response ===
export type UsersResponse = UserModel[];

export type UserSearchResponse = UsersResponse & {
  items: UserListModel[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

export type UserPostResponse = UserModel;

export type UserResponse = UserModel;

// === Request ===
export type UserSearchRequest = {
  name?: string;
  role?: string;
  isActive?: boolean;
};

export type UserPatchRequest = {
  name?: string;
  role?: string;
  isActive?: boolean;
};

export type UserPostRequest = {
  name: string;
  email: string;
  role: UserRole;
  password: string;
};
