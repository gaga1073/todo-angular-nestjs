import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { GroupDto } from '@/features/group/dto/response/group-dto';

@Exclude()
class UserIdNameDto {
  @Expose()
  @ApiProperty({ example: '01k4qb25x33ahegx765nrdcec9' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'public group1' })
  name!: string;
}

@Exclude()
class UserGroupDto extends GroupDto {
  @Expose()
  @Type(() => UserIdNameDto)
  @ApiProperty({ type: () => [UserIdNameDto] })
  users!: UserIdNameDto[];
}

@Exclude()
class Pagination {
  @Expose()
  @ApiProperty()
  currentPage!: number;

  @Expose()
  @ApiProperty()
  pageSize!: number;

  @Expose()
  @ApiProperty()
  totalPages!: number;

  @Expose()
  @ApiProperty()
  totalItems!: number;
}

@Exclude()
export class PostGroupSearchResponse {
  @Expose()
  @Type(() => UserGroupDto)
  @ApiProperty({ type: () => [UserGroupDto] })
  items!: UserGroupDto[];

  @Expose()
  @IsOptional()
  @Type(() => Pagination)
  @ApiProperty({ type: () => Pagination })
  pagination?: Pagination;
}
