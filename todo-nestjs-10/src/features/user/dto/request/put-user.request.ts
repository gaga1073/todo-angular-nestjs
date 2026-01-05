import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn, IsOptional } from 'class-validator';
import { USER_ROLE, UserRoleType } from '@/shared/constants/management.constant';

export class PutUserRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'テストユーザー' })
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@email.com' })
  email?: string;

  @IsOptional()
  @IsIn(USER_ROLE)
  @ApiProperty({ example: 'test@email.com' })
  role?: UserRoleType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Password1' })
  password?: string;
}
