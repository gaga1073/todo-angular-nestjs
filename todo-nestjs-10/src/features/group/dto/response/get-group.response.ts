import { UserDto } from '@/features/user/dto/response/user.dto';

export class GetGroupResponse {
  id!: string;
  name!: string;
  description?: string;
  users!: UserDto;
}
