import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import { Todo, TodosResponse } from '@/core/types/home-response.type';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  private todosSubject = new BehaviorSubject<Todo[]>([]);

  todos$ = this.todosSubject.asObservable();

  get todos() {
    return this.todosSubject.asObservable();
  }

  getTodos() {
    const res = this.apiService.get<TodosResponse>(this.endpoint.todo.todos).subscribe({
      next: (res) => {
        this.todosSubject.next(res.todos);
      },
      error: (err) => {
        throw err;
      },
    });
    return this.todos;
  }
}
