import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { TODO_STATUS, TodoStatusType } from '@/shared/constants/todo.constant';

export class PostTodoRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @ApiProperty({ example: 'サンプルTODO' })
  title!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'サンプルTODOの説明' })
  description!: string;

  @IsNotEmpty()
  @IsIn(TODO_STATUS)
  @ApiProperty({ example: 'NotStarted' })
  status!: TodoStatusType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '2024-12-31T23:59:59.000Z' })
  dueDate!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  assigneeId?: string;
}
