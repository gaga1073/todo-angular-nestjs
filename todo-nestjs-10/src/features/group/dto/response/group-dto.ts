import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GroupDto {
  @Expose()
  @ApiProperty({})
  id!: string;

  @Expose()
  @ApiProperty({})
  name!: string;

  @Expose()
  @ApiProperty({})
  description!: string;

  @Expose()
  @ApiProperty({})
  createAt!: string;

  @Expose()
  @ApiProperty({})
  updateAt!: string;
}
