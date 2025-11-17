import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { USER_ROLE, UserRoleType } from '@/shared/constants/management.constant';

export class PostUserRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'テストユーザー' })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@email.com' })
  email!: string;

  @IsNotEmpty()
  @IsIn(USER_ROLE)
  @ApiProperty({ example: 'test@email.com' })
  role!: UserRoleType;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Password1' })
  password!: string;
}
