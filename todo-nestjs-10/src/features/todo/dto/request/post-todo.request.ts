import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TODO_STATUS, TodoStatusType } from '@/shared/constants/todo.constant';

export class PostTodoRequest {
  @IsNotEmpty()
  @IsString()
  workspaceId!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  title!: string;

  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsEnum([TODO_STATUS])
  status!: TodoStatusType;

  @IsNotEmpty()
  @IsString()
  dueDate!: Date;

  @IsNotEmpty()
  @IsString()
  assigneeId?: string;

  @IsNotEmpty()
  @IsString()
  createdById!: string;
}
