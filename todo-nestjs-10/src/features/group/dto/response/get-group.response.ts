import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { GroupDto } from '@/features/group/dto/response/group-dto';
import { UserDto } from '@/features/user/dto/response/user.dto';

@Exclude()
export class GetGroupResponse extends GroupDto {
  @Expose()
  @ApiProperty({ type: [UserDto] })
  users!: UserDto[];
}
