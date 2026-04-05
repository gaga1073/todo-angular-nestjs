import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import { GroupsGetResponse } from '@/core/types/group.type';
import {
  ProjectGetResponse,
  ProjectPatchRequest,
  ProjectPatchResponse,
  ProjectPostRequest,
  ProjectPostResponse,
  ProjectSearchRequest,
  ProjectSearchResponse,
  ProjectsGetResponse,
} from '@/core/types/project.type';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  getProject(projectId: string) {
    return this.apiService.get<ProjectGetResponse>(this.endpoint.project.project(projectId));
  }

  getProjects() {
    return this.apiService.get<ProjectsGetResponse>(this.endpoint.project.projects());
  }

  getGroupList() {
    return this.apiService.get<GroupsGetResponse>(this.endpoint.group.groups());
  }
  getGroupsByUserId(userId: string) {
    return this.apiService.get<GroupsGetResponse>(this.endpoint.group.groupsByUserId(userId));
  }

  postProject(body: ProjectPostRequest) {
    return this.apiService.post<ProjectPostRequest, ProjectPostResponse>(
      this.endpoint.project.projects(),
      body,
    );
  }

  patchProject(projectId: string, body: ProjectPatchRequest) {
    return this.apiService.patch<ProjectPatchRequest, ProjectPatchResponse>(
      this.endpoint.project.project(projectId),
      body,
    );
  }

  postProjectSearch(body?: ProjectSearchRequest, page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.apiService.post<ProjectSearchRequest, ProjectSearchResponse>(
      this.endpoint.project.search(),
      body ?? {},
      {
        params: params,
      },
    );
  }

  deleteProject(projectId: string) {
    return this.apiService.delete(this.endpoint.project.project(projectId));
  }
}
