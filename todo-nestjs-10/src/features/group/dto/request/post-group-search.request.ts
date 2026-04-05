import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostGroupSearchRequest {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'テストグループ' })
  name?: string;
}
