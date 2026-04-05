import { Exclude, Expose } from 'class-transformer';
import { GroupDto } from '@/features/group/dto/response/group-dto';

@Exclude()
export class PatchGroupResponse extends GroupDto {
  @Expose()
  userIds!: string[];
}
