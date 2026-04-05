import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class PostGroupRequest {
  @IsString()
  @ApiProperty({ example: 'テストグループ' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'テストグループです。' })
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ example: ['01hzyc2028wmb3nj16wcv9z9e0'] })
  userIds!: string[];
}
