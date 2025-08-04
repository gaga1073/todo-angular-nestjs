import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'test_user' })
  username!: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'user@email.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'pass' })
  password!: string;
}
