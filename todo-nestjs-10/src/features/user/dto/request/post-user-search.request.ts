import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { UserRoleType } from '@/shared/constants/management.constant';

export class PostUserSearchRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'user1' })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'admin' })
  role?: UserRoleType;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: true })
  isActive?: boolean;
}
