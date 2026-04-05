import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PostProjectRequest {
  @IsString()
  @ApiProperty({ example: 'サンプルプロジェクト' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'サンプルプロジェクトの説明' })
  description!: string;

  @IsString()
  @ApiProperty({ example: '01k4qb25x33ahegx765nrdcec9' })
  groupId!: string;
}
