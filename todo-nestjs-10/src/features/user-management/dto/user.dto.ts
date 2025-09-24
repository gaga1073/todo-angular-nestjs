import { Exclude, Expose } from 'class-transformer';
import { Role } from '../domain/value-objects/role.type';

@Exclude()
export class UserDto {
  @Expose()
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  email!: string;

  @Expose()
  role!: Role;
}
