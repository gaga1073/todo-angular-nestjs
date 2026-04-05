import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import {
  TodoModel,
  TodoPostRequest,
  TodoSearchRequest,
  TodoSearchResponse,
  TodosResponse,
} from '@/core/types/todo.type';
import { UserResponse } from '@/core/types/user.type';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  private todosSubject = new BehaviorSubject<TodoModel[]>([]);

  todos$ = this.todosSubject.asObservable();

  get todos() {
    return this.todosSubject.asObservable();
  }

  getTodos(projectId: string) {
    return this.apiService.get<TodosResponse>(this.endpoint.todo.todos(projectId));
  }

  getTodo(projectId: string, todoId: string) {
    return this.apiService.get<TodoModel>(this.endpoint.todo.todo(projectId, todoId));
  }

  getUsersByProjectId(projectId: string) {
    return this.apiService.get<UserResponse[]>(this.endpoint.user.usersByProjectId(projectId));
  }

  postTodo(projectId: string, body: TodoPostRequest) {
    return this.apiService.post<TodoPostRequest, TodosResponse>(
      this.endpoint.todo.todos(projectId),
      body,
    );
  }

  postTodoSearch(projectId: string, body?: TodoSearchRequest, page = 1, pageSize = 10) {
    const params = new HttpParams().set('page', page).set('pageSize', pageSize);

    return this.apiService.post<TodoSearchRequest, TodoSearchResponse>(
      this.endpoint.todo.search(projectId),
      body ?? {},
      {
        params: params,
      },
    );
  }
}
