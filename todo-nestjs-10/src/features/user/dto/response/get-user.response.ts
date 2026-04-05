import { Exclude } from 'class-transformer';
import { UserDto } from '@/features/user/dto/response/user.dto';

@Exclude()
export class GetUserResponse extends UserDto {}
