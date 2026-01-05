import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import {
  GROUP_CLASSIFICATION,
  GroupClassificationType,
} from '@/shared/constants/management.constant';

export class GroupClassificationQuery {
  @IsOptional()
  @IsIn(GROUP_CLASSIFICATION)
  groupType?: GroupClassificationType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
