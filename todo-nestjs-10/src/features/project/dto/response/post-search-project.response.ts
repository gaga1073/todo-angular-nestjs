import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ProjectDto } from '@/features/project/dto/response/project.dto';

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
class GroupIdNameDto {
  @Expose()
  @ApiProperty({ example: '01k4qb25x33ahegx765nrdcec9' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'テストグループ' })
  name!: string;
}

@Exclude()
class ProjectGroupDto extends ProjectDto {
  @Expose()
  @Type(() => GroupIdNameDto)
  @ApiProperty({ type: () => GroupIdNameDto })
  group!: GroupIdNameDto;
}

@Exclude()
export class PostProjectSearchResponse {
  @Expose()
  @Type(() => ProjectGroupDto)
  @ApiProperty({ type: () => [ProjectGroupDto] })
  items!: ProjectGroupDto[];

  @Expose()
  @IsOptional()
  @Type(() => Pagination)
  @ApiProperty({ type: () => Pagination })
  pagination?: Pagination;
}
