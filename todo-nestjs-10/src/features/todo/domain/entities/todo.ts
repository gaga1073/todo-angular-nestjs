import { UserId } from '@/features/user/domain/value-objects/user-id.type';
import { WorkspaceId } from '@/features/workspace/domain/value-objects/workspace-id.type';
import { Entity } from '@/shared/base-class/domain/entity';
import { TodoStatusType } from '@/shared/constants/todo.constant';
import { TodoId } from '@/features/todo/domain/value-objects/todo-id.type';
import { TodoStatus } from '@/features/todo/domain/value-objects/todo-status.type';

type TodoProps = {
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  status: TodoStatus;
  dueDate: Date;
  assigneeId?: UserId;
  createdById: UserId;
};

type TodoCreateArgs = {
  workspaceId: string;
  title: string;
  description: string;
  status: TodoStatusType;
  dueDate: Date;
  assigneeId?: string;
  createdById: string;
};

export class Todo extends Entity<TodoId, TodoProps> {
  private constructor(id: TodoId, props: TodoProps) {
    super(id, props);
  }

  public get workspaceId(): WorkspaceId {
    return this.props.workspaceId;
  }

  public get title(): string {
    return this.props.title;
  }

  public get description(): string {
    return this.props.description;
  }

  public get status(): TodoStatus {
    return this.props.status;
  }

  public get dueDate(): Date {
    return this.props.dueDate;
  }

  public get assigneeId(): UserId | undefined {
    return this.props.assigneeId;
  }

  public get createdById(): UserId {
    return this.props.createdById;
  }

  public static create({
    workspaceId,
    title,
    description,
    status,
    dueDate,
    assigneeId,
    createdById,
  }: TodoCreateArgs): Todo {
    const todoId = TodoId.newCreate();
    return new Todo(todoId, {
      workspaceId: WorkspaceId.create(workspaceId),
      title: title,
      description: description,
      status: TodoStatus.create(status),
      dueDate: dueDate,
      assigneeId: assigneeId ? UserId.create(assigneeId) : undefined,
      createdById: UserId.create(createdById),
    });
  }

  public static restore({
    id,
    workspaceId,
    title,
    description,
    status,
    dueDate,
    assigneeId,
    createdById,
  }: { id: string } & TodoCreateArgs): Todo {
    const todoId = TodoId.create(id);
    return new Todo(todoId, {
      workspaceId: WorkspaceId.create(workspaceId),
      title: title,
      description: description,
      status: TodoStatus.create(status),
      dueDate: dueDate,
      assigneeId: assigneeId !== undefined ? UserId.create(assigneeId) : undefined,
      createdById: UserId.create(createdById),
    });
  }
}
