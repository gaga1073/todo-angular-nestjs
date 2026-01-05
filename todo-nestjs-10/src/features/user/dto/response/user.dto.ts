import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user1' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'user1@email.com' })
  email!: string;

  @Expose()
  @ApiProperty({ example: 'admin' })
  role!: UserRoleType;

  @Expose()
  @ApiProperty({ example: '2025-09-09T12:00:00+09:00' })
  updateAt!: string;

  @Expose()
  @ApiProperty({ example: '2025-09-09T12:00:00+09:00' })
  createAt!: string;

  @Expose()
  @ApiProperty({ example: true })
  isActive!: boolean;

  @Expose()
  @ApiProperty({ example: false })
  isDeleted!: boolean;
}
