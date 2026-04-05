import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PostProjectSearchRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'プロジェクト名', required: false })
  name?: string;
}
