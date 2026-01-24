import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsIn, IsOptional } from 'class-validator';
import { USER_ROLE, UserRoleType } from '@/shared/constants/management.constant';

export class PatchUserRequest {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'テストユーザー',required: false })
  name?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@email.com',required: false })
  email?: string;

  @IsOptional()
  @IsIn(USER_ROLE)
  @ApiProperty({ example: 'test@email.com',required: false })
  role?: UserRoleType;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'Password1' ,required: false})
  password?: string;
}
