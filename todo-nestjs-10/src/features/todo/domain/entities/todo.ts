import { Entity } from '@/core/domain/base-classes/entity';
import { ProjectId } from '@/features/project/domain/value-objects/project-id.type';
import { TodoId } from '@/features/todo/domain/value-objects/todo-id.type';
import { TodoStatus } from '@/features/todo/domain/value-objects/todo-status.type';
import { UserId } from '@/features/user/domain/value-objects/user-id.type';
import { TodoStatusType } from '@/shared/constants/todo.constant';

type TodoProps = {
  projectId: ProjectId;
  title: string;
  description: string;
  status: TodoStatus;
  dueDate: Date;
  assigneeId?: UserId;
  createById: UserId;
  isDeleted: boolean;
  updateAt: Date;
  createAt: Date;
};

type TodoCreateArgs = {
  projectId: string;
  title: string;
  description: string;
  status: TodoStatusType;
  dueDate: Date;
  assigneeId?: string;
  createById: string;
};

type TodoRestoreArgs = {
  title: string;
  projectId: string;
  description: string;
  status: TodoStatusType;
  dueDate: Date;
  assigneeId?: string;
  createById: string;
  isDeleted: boolean;
  updateAt: Date;
  createAt: Date;
};

export class Todo extends Entity<TodoId, TodoProps> {
  private constructor(id: TodoId, props: TodoProps) {
    super(id, props);
  }

  public get projectId(): ProjectId {
    return this.props.projectId;
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
  public get createById(): UserId {
    return this.props.createById;
  }
  public get isDeleted(): boolean {
    return this.props.isDeleted;
  }
  public get updateAt(): Date {
    return this.props.updateAt;
  }
  public get createAt(): Date {
    return this.props.createAt;
  }

  public static create({
    projectId,
    title,
    description,
    status,
    dueDate,
    assigneeId,
    createById,
  }: TodoCreateArgs): Todo {
    const todoId = TodoId.newCreate();
    return new Todo(todoId, {
      projectId: ProjectId.create(projectId),
      title: title,
      description: description,
      status: TodoStatus.create(status),
      dueDate: dueDate,
      assigneeId: assigneeId ? UserId.create(assigneeId) : undefined,
      createById: UserId.create(createById),
      isDeleted: false,
      updateAt: new Date(),
      createAt: new Date(),
    });
  }

  public static restore({
    id,
    projectId,
    title,
    description,
    status,
    dueDate,
    assigneeId,
    createById,
    isDeleted,
    updateAt,
    createAt,
  }: { id: string } & TodoRestoreArgs): Todo {
    const todoId = TodoId.create(id);
    return new Todo(todoId, {
      projectId: ProjectId.create(projectId),
      title: title,
      description: description,
      status: TodoStatus.create(status),
      dueDate: dueDate,
      assigneeId: assigneeId !== undefined ? UserId.create(assigneeId) : undefined,
      createById: UserId.create(createById),
      updateAt: updateAt,
      createAt: createAt,
      isDeleted: isDeleted,
    });
  }

  public update({
    title,
    description,
    status,
    dueDate,
    assigneeId,
  }: {
    title?: string;
    description?: string;
    status?: TodoStatusType;
    dueDate?: Date;
    assigneeId?: string;
  }): void {
    if (title) {
      this.props.title = title;
    }
    if (description) {
      this.props.description = description;
    }
    if (status) {
      this.props.status = TodoStatus.create(status);
    }
    if (dueDate) {
      this.props.dueDate = dueDate;
    }
    if (assigneeId) {
      this.props.assigneeId = UserId.create(assigneeId);
    }

    this.props.updateAt = new Date();
  }

  public delete(): void {
    this.props.isDeleted = true;
    this.props.updateAt = new Date();
  }
}
