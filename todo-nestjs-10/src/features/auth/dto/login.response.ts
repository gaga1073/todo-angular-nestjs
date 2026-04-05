import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'user@email.com' })
  email!: string;

  @Expose()
  @ApiProperty({ example: '山田' })
  name!: string;

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
