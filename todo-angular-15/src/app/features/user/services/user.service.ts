import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import {
  UserModel,
  UserPatchRequest,
  UserResponse,
  UserSearchRequest,
  UserSearchResponse,
  UsersResponse,
} from '@/core/types/user-response.type';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  private usersSubject = new BehaviorSubject<UserModel[]>([]);
  // private userSearchListSubject = new BehaviorSubject<UserSearchList | null>(null);

  users$ = this.usersSubject.asObservable();
  get todos() {
    return this.usersSubject.asObservable();
  }

  getUsersForPublicGroups(page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('groupType', 'public')
      .set('page', page)
      .set('pageSize', pageSize);

    this.apiService.get<UsersResponse>(`${this.endpoint.user.users}`, { params }).subscribe({
      next: (res) => {
        this.usersSubject.next(res.users);
      },
      error: (err) => {
        throw err;
      },
    });
    return this.todos;
  }

  getUser(userId: string) {
    return this.apiService.get<UserResponse>(`${this.endpoint.user.users}/${userId}`);
  }

  postUsersSearch(body?: UserSearchRequest, page = 1, pageSize = 10) {
    const params = new HttpParams()
      .set('groupType', 'public')
      .set('page', page)
      .set('pageSize', pageSize);

    return this.apiService.post<UserSearchRequest, UserSearchResponse>(
      `${this.endpoint.user.search}`,
      body ?? {},
      { params },
    );
  }

  patchUser(userId: string, body: UserPatchRequest) {
    return this.apiService.patch<UserPatchRequest, UserResponse>(
      `${this.endpoint.user.users}/${userId}`,
      body,
    );
  }
}
