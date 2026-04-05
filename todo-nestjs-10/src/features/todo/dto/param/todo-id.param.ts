import { ApiProperty } from '@nestjs/swagger';
import { IsUlid } from '@/shared/validators/is-ulid.validator';

export class TodoIdParam {
  @IsUlid()
  @ApiProperty({ example: '01k4qdx4bjprrfh23t3hwmq7nc' })
  todoId!: string;
}
