import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'user@email.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @ApiProperty({ example: 'Password1' })
  password!: string;
}
