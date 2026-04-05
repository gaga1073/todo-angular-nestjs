import { IsIn, IsOptional } from 'class-validator';
import {
  GROUP_CLASSIFICATION,
  GroupClassificationType,
} from '@/shared/constants/management.constant';

export class GroupTypeQuery {
  @IsOptional()
  @IsIn(GROUP_CLASSIFICATION)
  groupType?: GroupClassificationType;
}
