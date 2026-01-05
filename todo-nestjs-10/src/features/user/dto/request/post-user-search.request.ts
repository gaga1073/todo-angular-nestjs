import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';

export class PostUserSearchRequest {
  @Expose()
  @ApiProperty({ example: 'user1' })
  name?: string;

  @Expose()
  @ApiProperty({ example: 'admin' })
  role?: UserRoleType;

  @Expose()
  @ApiProperty({ example: true })
  isActive?: boolean;
}
