import { Exclude } from 'class-transformer';
import { GroupDto } from '@/features/group/dto/response/group-dto';

@Exclude()
export class GetGroupsResponse extends GroupDto {}
