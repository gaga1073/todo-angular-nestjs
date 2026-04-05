import { Exclude, Expose } from 'class-transformer';
import { GroupDto } from '@/features/group/dto/response/group-dto';

@Exclude()
export class PostGroupResponse extends GroupDto {
  @Expose()
  userIds!: string[];
}
