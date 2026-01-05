import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsString } from 'class-validator';
import { USER_ROLE, UserRoleType } from '@/shared/constants/management.constant';

export class PostUserRequest {
  @IsString()
  @ApiProperty({ example: 'テストユーザー' })
  username!: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@email.com' })
  email!: string;

  @IsIn(USER_ROLE)
  @ApiProperty({ example: 'test@email.com' })
  role!: UserRoleType;

  @IsString()
  @ApiProperty({ example: 'Password1' })
  password!: string;
}
