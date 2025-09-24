import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest {
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
  @IsString()
  @ApiProperty({ example: 'Password1' })
  password!: string;
}
