// === Base ===
export type TodoStatus = 'NotStarted' | 'InProgress' | 'Completed';

export type TodoModel = {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  dueDate: string;
  assignee: {
    id: string;
    name: string;
  };
  createBy: {
    id: string;
    name: string;
  };
};

// === Response ===
export type TodosResponse = TodoModel[];

export type TodoSearchResponse = {
  items: TodoModel[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

// === Request ===
export type TodoSearchRequest = {
  title?: string;
  status?: string;
  dueDate?: string;
  assigneeUserName?: string;
  createUserName?: string;
};

export type TodoPostRequest = {
  title: string;
  description: string;
  assigneeId: string;
  dueDate: string;
};
