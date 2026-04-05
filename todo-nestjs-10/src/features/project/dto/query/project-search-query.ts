import { Type } from 'class-transformer';
import { IsOptional, IsNumber } from 'class-validator';

export class ProjectSearchQuery {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number;
}
