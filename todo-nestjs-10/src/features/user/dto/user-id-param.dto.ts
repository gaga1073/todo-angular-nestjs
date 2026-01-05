import { ApiProperty } from '@nestjs/swagger';
import { IsUlid } from '@/shared/validators/is-ulid.validator';

export class UserIdParam {
  @IsUlid()
  @ApiProperty({ example: '01K4QB25X33AHEGX765NRDCEC9' })
  userId!: string;
}
