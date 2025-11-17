import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
class Assignee {
  @Expose()
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user1' })
  name!: string;
}

@Exclude()
class createBy {
  @Expose()
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user1' })
  name!: string;
}

@Exclude()
export class TodoDto {
  @Expose()
  @ApiProperty({ example: '01K65P9N431A5XPB0YY5BESCWY' })
  id!: string;

  @Expose()
  @ApiProperty({ example: '01K4QDX4BJPRRFH23T3HWMQ7NC' })
  workspaceId!: string;

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
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  assignee!: Assignee;

  @Expose()
  @Type(() => createBy)
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  createBy!: createBy;
}
