import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import { GroupsByUserIdResponse } from '@/core/types/group.type';
import {
  UserPatchRequest,
  UserPostRequest,
  UserPostResponse,
  UserResponse,
  UserSearchRequest,
  UserSearchResponse,
} from '@/core/types/user.type';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  getUser(userId: string) {
    return this.apiService.get<UserResponse>(this.endpoint.user.user(userId));
  }

  getGroupsByUserId(userId: string) {
    const params = new HttpParams().set('groupType', 'public');

    return this.apiService.get<GroupsByUserIdResponse>(this.endpoint.group.groupsByUserId(userId), {
      params,
    });
  }

  postUser(body: UserPostRequest) {
    return this.apiService.post<UserPostRequest, UserPostResponse>(
      this.endpoint.user.users(),
      body,
    );
  }

  postUsersSearch(body?: UserSearchRequest, page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('groupType', 'public')
      .set('page', page)
      .set('pageSize', pageSize);

    return this.apiService.post<UserSearchRequest, UserSearchResponse>(
      this.endpoint.user.search(),
      body ?? {},
      { params },
    );
  }

  patchUser(userId: string, body: UserPatchRequest) {
    return this.apiService.patch<UserPatchRequest, UserResponse>(
      this.endpoint.user.user(userId),
      body,
    );
  }

  deleteUser(userId: string) {
    return this.apiService.delete(this.endpoint.user.user(userId));
  }
}
