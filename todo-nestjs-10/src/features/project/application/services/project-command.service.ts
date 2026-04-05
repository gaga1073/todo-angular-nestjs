import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeprovisionProjectService } from '@/core/application/services/deprovision-project.service';
import { UserDto } from '@/features/auth/dto/login.response';
import { GroupId } from '@/features/group/domain/value-objects/group-id.type';
import { Project } from '@/features/project/domain/entities/project';
import {
  IProjectGroupAccessPort,
  IProjectGroupAccessPortToken,
} from '@/features/project/domain/ports/project-group-access.port';
import {
  IProjectRepository,
  IProjectRepositoryToken,
} from '@/features/project/domain/repositories/project-repository.interface';
import { PatchProjectRequest } from '@/features/project/dto/request/patch-project.request';
import { PostProjectRequest } from '@/features/project/dto/request/post-project.request';
import { PatchProjectResponse } from '@/features/project/dto/response/patch-project.response';
import { PostProjectResponse } from '@/features/project/dto/response/post-project.response';

@Injectable()
export class ProjectCommandService {
  constructor(
    private readonly deprovisionProjectService: DeprovisionProjectService,
    @Inject(IProjectRepositoryToken) private readonly projectRepository: IProjectRepository,
    @Inject(IProjectGroupAccessPortToken) private readonly groupAccessPort: IProjectGroupAccessPort,
  ) {}

  public async createProject(
    request: PostProjectRequest,
    loginUser: UserDto,
  ): Promise<PostProjectResponse> {
    const isMember = await this.groupAccessPort.isMember(loginUser.id, request.groupId);
    if (!isMember) {
      throw new ForbiddenException('指定されたグループに所属していません。');
    }

    const project = Project.createPublicProject({
      name: request.name,
      description: request.description,
      groupId: GroupId.create(request.groupId),
      createById: loginUser.id,
    });

    await this.projectRepository.create(project);

    return plainToInstance(PostProjectResponse, {
      id: project.id,
      name: project.name,
      description: project.description,
      createById: project.createById,
      groupId: project.groupId,
      updateAt: project.updateAt,
      createAt: project.createAt,
    });
  }

  public async updateProject(
    projectId: string,
    request: PatchProjectRequest,
    loginUser: UserDto,
  ): Promise<PatchProjectResponse> {
    const { name, description } = request;

    const { project, version } = await this.projectRepository.restoreAggregate(projectId);

    const isMember = await this.groupAccessPort.isMember(loginUser.id, project.groupId);
    if (!isMember) {
      throw new ForbiddenException('指定されたプロジェクトのグループに所属していません。');
    }

    project.update({ name, description });
    await this.projectRepository.save(project, version);

    return plainToInstance(PatchProjectResponse, {
      id: project.id,
      name: project.name,
      description: project.description,
      createById: project.createById,
      groupId: project.groupId,
      updateAt: project.updateAt,
      createAt: project.createAt,
    });
  }

  public async deleteProject(projectId: string, loginUser: UserDto): Promise<void> {
    const { project, version } = await this.projectRepository.restoreAggregate(projectId);

    const isMember = await this.groupAccessPort.isMember(loginUser.id, project.groupId);
    if (!isMember) {
      throw new ForbiddenException('指定されたプロジェクトのグループに所属していません。');
    }

    await this.deprovisionProjectService.execute(project, version);
  }
}
