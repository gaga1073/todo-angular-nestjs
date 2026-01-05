export type TodosResponse = {
  todos: Todo[];
};

export type TodoStatus = 'NotStarted' | 'InProgress' | 'Completed';

export type Todo = {
  id: string;
  workspaceId: string;
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
