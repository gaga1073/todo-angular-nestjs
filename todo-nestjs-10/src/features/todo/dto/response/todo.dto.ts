import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Assignee {
  @Expose()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user1' })
  name!: string;
}

@Exclude()
class createBy {
  @Expose()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user1' })
  name!: string;
}

@Exclude()
export class TodoDto {
  @Expose()
  @ApiProperty({ example: '01k65p9n431a5xpb0yy5bescwy' })
  id!: string;

  @Expose()
  @ApiProperty({ example: '01k4qdx4bjprrfh23t3hwmq7nc' })
  projectId!: string;

  @Expose()
  @ApiProperty({ example: '作業' })
  title!: string;

  @Expose()
  @ApiProperty({ example: '説明テスト' })
  description!: string;

  @Expose()
  @ApiProperty({ example: 'NotStarted' })
  status!: string;

  @Expose()
  @ApiProperty({ example: '2026-09-09' })
  dueDate!: Date;

  @Expose()
  @Type(() => Assignee)
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  assignee!: Assignee;

  @Expose()
  @Type(() => createBy)
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  createBy!: createBy;
}
