import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/core/guards/jwt-auth.guard';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  @Get('/')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sample() {
    return;
  }

  @Get('/sample')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async sampleUser() {
    return;
  }
}
