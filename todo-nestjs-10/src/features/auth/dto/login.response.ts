import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly username!: string;
}

@Exclude()
export class LoginResponse {
  @Type(() => UserDto)
  @Expose()
  user!: UserDto;

  @Expose()
  accessToken!: string;
}
