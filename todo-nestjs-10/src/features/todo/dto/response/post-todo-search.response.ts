import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { TodoDto } from '@/features/todo/dto/response/todo.dto';

@Exclude()
class Pagination {
  @Expose()
  @ApiProperty()
  currentPage!: number;

  @Expose()
  @ApiProperty()
  pageSize!: number;

  @Expose()
  @ApiProperty()
  totalPages!: number;

  @Expose()
  @ApiProperty()
  totalItems!: number;
}

@Exclude()
export class PostTodoSearchResponse {
  @Expose()
  @Type(() => TodoDto)
  @ApiProperty({ type: () => [TodoDto] })
  items!: TodoDto[];

  @Expose()
  @IsOptional()
  @Type(() => Pagination)
  @ApiProperty({ type: () => Pagination })
  pagination?: Pagination;
}
