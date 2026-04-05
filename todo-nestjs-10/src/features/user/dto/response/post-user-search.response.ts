import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { UserDto } from '@/features/user/dto/response/user.dto';
import { GroupClassificationType } from '@/shared/constants/management.constant';

@Exclude()
class GroupDto {
  @Expose()
  @ApiProperty({ example: '01k4qb25x33ahegx765nrdcec9' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'public group1' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'public' })
  groupClassification!: GroupClassificationType;
}

@Exclude()
class UserGroupDto extends UserDto {
  @Expose()
  @Type(() => GroupDto)
  @ApiProperty({ type: () => GroupDto })
  groups!: GroupDto[];
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
export class PostUserSearchResponse {
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
