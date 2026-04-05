import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ProjectIdParam } from '../dto/param/project-id.param';
import { UserDto } from '@/features/auth/dto/login.response';
import { ProjectCommandService } from '@/features/project/application/services/project-command.service';
import { ProjectQueryService } from '@/features/project/application/services/project-query.service';
import { ProjectSearchQuery } from '@/features/project/dto/query/project-search-query';
import { PatchProjectRequest } from '@/features/project/dto/request/patch-project.request';
import { PostProjectSearchRequest } from '@/features/project/dto/request/post-project-search.request';
import { PostProjectRequest } from '@/features/project/dto/request/post-project.request';
import { getProjectResponse } from '@/features/project/dto/response/get-project.response';
import { getProjectsResponse } from '@/features/project/dto/response/get-projects.response';
import { PatchProjectResponse } from '@/features/project/dto/response/patch-project.response';
import { PostProjectResponse } from '@/features/project/dto/response/post-project.response';
import { PostProjectSearchResponse } from '@/features/project/dto/response/post-search-project.response';
import { AuthUser } from '@/shared/decorators/auth-user.decorator';
import { JwtAuthGuard } from '@/shared/guards/jwt-auth.guard';
import { UserRolesGuard } from '@/shared/guards/user-role.guard';
import { AppLoggerFactory } from '@/shared/providers/app-logger.factory';
import { AppLogger } from '@/shared/utils/app-logger.util';

@Controller()
@ApiTags('Project')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, UserRolesGuard)
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
export class ProjectController {
  appLogger: AppLogger;

  constructor(
    private readonly projectQueryService: ProjectQueryService,
    private readonly projectCommandService: ProjectCommandService,
    private readonly appLoggerFactory: AppLoggerFactory,
  ) {
    this.appLogger = this.appLoggerFactory.create(ProjectController.name);
  }

  @Get('/projects')
  @HttpCode(200)
  @ApiOperation({
    summary: `プロジェクト取得`,
    description: `
  プロジェクトの一覧を取得します
  `,
  })
  @ApiOkResponse({ description: 'Success', type: [getProjectsResponse] })
  public async getProjects(@AuthUser() loginUser: UserDto): Promise<getProjectsResponse[]> {
    this.appLogger.info('[GET] /projects is invoked', { method: this.getProjects.name });
    const response = await this.projectQueryService.findProjects(loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Get('/projects/:projectId')
  @HttpCode(200)
  @ApiOperation({
    summary: `プロジェクト取得`,
    description: `
  プロジェクトの詳細を取得します
  `,
  })
  @ApiOkResponse({ description: 'Success', type: getProjectResponse })
  public async getProject(
    @AuthUser() loginUser: UserDto,
    @Param() { projectId }: ProjectIdParam,
  ): Promise<getProjectResponse> {
    this.appLogger.info(`[GET] /projects/${projectId} is invoked`, {
      method: this.getProject.name,
    });
    const response = await this.projectQueryService.findProjectById(projectId, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/projects')
  @HttpCode(201)
  @ApiOperation({
    summary: `プロジェクト作成`,
    description: ` 
  プロジェクトを作成します
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PostProjectResponse })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async postProject(
    @AuthUser() loginUser: UserDto,
    @Body() body: PostProjectRequest,
  ): Promise<PostProjectResponse> {
    this.appLogger.info(`[POST] /projects is invoked`, {
      method: this.postProject.name,
    });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const response = await this.projectCommandService.createProject(body, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Patch('/projects/:projectId')
  @HttpCode(200)
  @ApiOperation({
    summary: `プロジェクト更新`,
    description: `
  プロジェクトを更新します
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PatchProjectResponse })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public patchProject(
    @AuthUser() loginUser: UserDto,
    @Param() { projectId }: ProjectIdParam,
    @Body() body: PatchProjectRequest,
  ): Promise<PatchProjectResponse> {
    this.appLogger.info(`[PATCH] /projects/${projectId} is invoked`, {
      method: this.patchProject.name,
    });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const response = this.projectCommandService.updateProject(projectId, body, loginUser);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Post('/projects/search')
  @HttpCode(200)
  @ApiOperation({
    summary: `プロジェクト検索`,
    description: `
  プロジェクトを検索します
  `,
  })
  @ApiOkResponse({ description: 'Success', type: PostProjectSearchResponse })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'pageSize', example: 10, required: false })
  public async PostSearchProject(
    @AuthUser() loginUser: UserDto,
    @Query() { page, pageSize }: ProjectSearchQuery,
    @Body() body: PostProjectSearchRequest,
  ): Promise<PostProjectSearchResponse> {
    this.appLogger.info(`[POST] /projects/search is invoked`, {
      method: this.PostSearchProject.name,
    });
    this.appLogger.debug(`request body: ${JSON.stringify(body, null, 2)}`);

    const pagination = page && pageSize ? { page, pageSize } : undefined;
    const response = await this.projectQueryService.findSearch(loginUser, body, pagination);

    this.appLogger.debug(`response body: ${JSON.stringify(response, null, 2)}`);
    return response;
  }

  @Delete('/projects/:projectId')
  @HttpCode(200)
  @ApiOperation({
    summary: `プロジェクト削除`,
    description: `
  プロジェクトを削除します
  `,
  })
  @ApiOkResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  public async deleteProject(
    @AuthUser() loginUser: UserDto,
    @Param() { projectId }: ProjectIdParam,
  ): Promise<void> {
    this.appLogger.info(`[DELETE] /projects/${projectId} is invoked`, {
      method: this.deleteProject.name,
    });

    await this.projectCommandService.deleteProject(projectId, loginUser);
    return;
  }
}
