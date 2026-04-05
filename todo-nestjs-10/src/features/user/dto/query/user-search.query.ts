import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { GroupTypeQuery } from '@/features/group/dto/query/group-classification.query';

export class UserSearchQuery extends GroupTypeQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
