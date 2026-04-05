import { ApiProperty } from '@nestjs/swagger';
import { IsUlid } from '@/shared/validators/is-ulid.validator';

export class ProjectIdParam {
  @IsUlid()
  @ApiProperty({ example: '01k4qdx4bjprrfh23t3hwmq7nc' })
  projectId!: string;
}
