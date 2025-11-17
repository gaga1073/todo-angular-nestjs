import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { TodoDto } from '@/features/todo/dto/response/todo.dto';

@Exclude()
export class GetTodosResponse {
  @Type(() => TodoDto)
  @Expose()
  @ApiProperty({ type: [TodoDto] })
  todos!: TodoDto[];
}
