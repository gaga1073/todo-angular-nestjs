import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class PatchGroupRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'テストグループ' })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'テストグループです。' })
  description?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @ApiProperty({ example: ['01hzyc2028wmb3nj16wcv9z9e0'] })
  userIds?: string[];
}
