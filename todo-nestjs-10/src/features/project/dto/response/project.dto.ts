import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProjectDto {
  @Expose()
  @ApiProperty({ example: '01k4qdx4bjprrfh23t3hwmq7nc' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Project Name' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'Project Description' })
  description!: string;

  @Expose()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  createById!: string;

  @Expose()
  @ApiProperty({ example: '2024-06-01T00:00:00Z' })
  updateAt!: Date;

  @Expose()
  @ApiProperty({ example: '2024-06-01T00:00:00Z' })
  createAt!: Date;
}
