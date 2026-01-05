export type UsersResponse = {
  users: User[];
};

export type UserRole = 'admin' | 'general';

export type GroupClassification = 'public' | 'private';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isDeleted: boolean;
  createAt: string;
  updateAt: string;
  groups: {
    id: string;
    name: string;
    groupClassification: string;
  }[];
};

export type UserSearchList = UserSearchResponse;

export type UserSearchResponse = UsersResponse & {
  pagenation: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

export type UserSearchRequest = {
  name?: string;
  role?: string;
  isActive?: boolean;
};
