import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import {
  GroupGetResponse,
  GroupPostRequest,
  GroupPostResponse,
  GroupSearchRequest,
  GroupsGetResponse,
  GroupSearchResponse,
  GroupPatchRequest,
  GroupPatchResponse,
} from '@/core/types/group.type';
import { UsersResponse } from '@/core/types/user.type';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  getGroup(groupId: string) {
    return this.apiService.get<GroupGetResponse>(this.endpoint.group.group(groupId));
  }

  getGroups() {
    return this.apiService.get<GroupsGetResponse>(this.endpoint.group.groups());
  }

  getUsersByGroupId(groupId: string) {
    return this.apiService.get<UsersResponse>(this.endpoint.user.usersByGroupId(groupId));
  }

  getUsersList() {
    return this.apiService.get<UsersResponse>(this.endpoint.user.users());
  }

  postGroup(body: GroupPostRequest) {
    return this.apiService.post<GroupPostRequest, GroupPostResponse>(
      this.endpoint.group.groups(),
      body,
    );
  }

  postGroupSearch(body?: GroupSearchRequest, page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('groupType', 'public')
      .set('page', page)
      .set('pageSize', pageSize);

    return this.apiService.post<GroupSearchRequest, GroupSearchResponse>(
      this.endpoint.group.search(),
      body ?? {},
      { params },
    );
  }

  patchGroup(groupId: string, body: GroupPatchRequest) {
    return this.apiService.patch<GroupPatchRequest, GroupPatchResponse>(
      this.endpoint.group.group(groupId),
      body,
    );
  }

  deleteGroup(groupId: string) {
    return this.apiService.delete(this.endpoint.group.group(groupId));
  }
}
