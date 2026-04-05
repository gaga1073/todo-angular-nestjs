import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { TODO_STATUS, TodoStatusType } from '@/shared/constants/todo.constant';

export class PostTodoSearchRequest {
  @IsOptional()
  @IsString()
  @MaxLength(30)
  @ApiProperty({ example: 'サンプルTODO' })
  title?: string;

  @IsOptional()
  @IsIn(TODO_STATUS)
  @ApiProperty({ example: 'NotStarted' })
  status?: TodoStatusType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '2024-12-31T23:59:59.000Z' })
  dueDate?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  assigneeId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  createById?: string;
}
