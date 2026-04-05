import { ApiProperty } from '@nestjs/swagger';
import { IsUlid } from '@/shared/validators/is-ulid.validator';

export class UserIdParam {
  @IsUlid()
  @ApiProperty({ example: '01hzyc2028wmb3nj16wcv9z9e0' })
  userId!: string;
}
