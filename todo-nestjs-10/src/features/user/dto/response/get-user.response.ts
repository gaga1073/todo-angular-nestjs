import { UserDto } from '@/features/user/dto/response/user.dto';
import { Exclude } from 'class-transformer';

@Exclude()
export class GetUserResponse extends UserDto {}
