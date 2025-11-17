import { Exclude, Expose } from 'class-transformer';
import { UserRoleType } from '@/shared/constants/management.constant';

@Exclude()
export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: UserRoleType;
}
