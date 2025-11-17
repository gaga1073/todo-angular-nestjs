import { IsString } from 'class-validator';

export class GroupIdParamDto {
  @IsString()
  groupId!: string;
}
