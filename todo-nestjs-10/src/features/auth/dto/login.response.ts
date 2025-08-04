import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  @ApiProperty({ example: '01HZYC2028WMB3NJ16WCV9Z9E0' })
  readonly id!: string;

  @Expose()
  @ApiProperty({ example: 'user@email.com' })
  readonly email!: string;

  @Expose()
  @ApiProperty({ example: '山田' })
  readonly username!: string;
}

@Exclude()
export class LoginResponse {
  @Type(() => UserDto)
  @Expose()
  @ApiProperty({ type: UserDto })
  user!: UserDto;

  @Expose()
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiX3ZhbHVlIjoiMDFIWllDMjAyOFdNQjNOSjE2V0NWOVo5RTAifSwiZW1haWwiOiJ1c2VyQGVtYWlsLmNvbSIsImlhdCI6MTc1NDMxMDg1NywiZXhwIjoxNzU0MzEwOTE3LCJhdWQiOiJBdXRoZW5pY2F0ZWQgVXNlcnMiLCJpc3MiOiJOZXN0IEFkdmFuY2UgSldUIEF1dGhlbnRpY2F0aW9uIn0.sMvcA_ifmY5nSryR6GTzEavkRIP2YcmALwwKDcA_pwHo_XoavIazLazDeNF_lEKbO9WbbSitPoqlT3idahIc-g',
  })
  accessToken!: string;
}
