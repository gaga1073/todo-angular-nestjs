import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GroupIdParam {
  @IsString()
  @ApiProperty({ example: '01k4qb25x33ahegx765nrdcec9' })
  groupId!: string;
}
