import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PatchProjectRequest {
  @IsString()
  @ApiProperty({ example: 'サンプルプロジェクト' })
  name!: string;

  @IsString()
  @ApiProperty({ example: 'サンプルプロジェクトの説明' })
  description!: string;
}
