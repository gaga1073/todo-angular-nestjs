import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  readonly id!: string;

  @Expose()
  @ApiProperty({ example: 'user@email.com' })
  readonly email!: string;

  @Expose()
  @ApiProperty({ example: '山田' })
  readonly name!: string;

  @Expose()
  @ApiProperty({ example: 'admin' })
  role!: UserRoleType;
}

@Exclude()
export class AuthResponse {
  @Type(() => UserDto)
  @Expose()
  @ApiProperty({ type: UserDto })
  user!: UserDto;
}
