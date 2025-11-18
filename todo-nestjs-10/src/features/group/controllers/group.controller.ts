import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam } from '@nestjs/swagger';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { GroupIdParamDto } from '@/features/group/dto/group-id-param.dto';
import { GetGroupResponse } from '@/features/group/dto/response/get-group.response';
import { GroupQueryService } from '@/features/group/services/group-query.service';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller('group')
export class GroupController {
  private appLogger: AppLogger;

  constructor(
    private readonly appLoggerFactory: AppLoggerFactory,
    private readonly groupQueryService: GroupQueryService,
  ) {
    this.appLogger = this.appLoggerFactory.create(GroupController.name);
  }

  @Get('/:groupId')
  @ApiParam({ name: 'groupId' })
  public async getGroup(@Param() { groupId }: GroupIdParamDto): Promise<GetGroupResponse> {
    const response = this.groupQueryService.getGroup(groupId);
    return response;
  }
}
