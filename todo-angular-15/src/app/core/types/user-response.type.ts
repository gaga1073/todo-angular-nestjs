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
export type UsersResponse = {
  users: UserListModel[];
};

export type UserSearchResponse = UsersResponse & {
  pagenation: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

export type UserResponse = UserModel;

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
