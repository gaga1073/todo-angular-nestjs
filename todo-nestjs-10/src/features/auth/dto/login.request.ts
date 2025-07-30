import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'user@email.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'pass' })
  password!: string;
}
