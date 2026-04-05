import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { tap, catchError, throwError, finalize, Observable, forkJoin } from 'rxjs';
import { TodoService } from '@/features/todo/services/todo.service';
import { CurrentUserStore } from '@/core/stores/current-user.store';
import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { TodoModel, TodoSearchResponse } from '@/core/types/todo.type';
import { CreateModalComponent } from '@/features/todo/components/create-modal/create-modal.component';
import { DetailModalComponent } from '../../components/detail-modal/detail-modal.component';

export type SearchTodoCondition = {
  title?: string;
  status?: string;
  dueDate?: string;
  assigneeUserId?: string;
  createUserId?: string;
};

@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.scss'],
})
export class TodoDetailComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly loadingService = inject(LoadingService);
  private readonly bsModalService = inject(BsModalService);
  private readonly dialogService = inject(DialogService);
  private readonly currentUserStore = inject(CurrentUserStore);
  private readonly route = inject(ActivatedRoute);

  todos!: TodoModel[];
  searchUsers!: { id: string; name: string }[];

  projectId = '';

  totalItems = 0;
  currentPage = 1;

  searchCondition?: SearchTodoCondition;

  bsModalRef?: BsModalRef;

  ngOnInit(): void {
    this.projectId = this.getProjectIdFromRoute();
    this.handlePageChanged();
  }

  onClickCreate() {
    this.bsModalRef = this.bsModalService.show(CreateModalComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-lg modal-dialog-centered',
      initialState: {
        users: this.searchUsers,
        projectId: this.projectId,
      },
    });
    this.bsModalRef.onHidden?.subscribe(() => {
      this.handlePageChanged();
    });
  }

  handleSearch(searchCondition: SearchTodoCondition) {
    this.searchCondition = searchCondition;

    const page = 1;
    this.searchProject(searchCondition, page).subscribe();
  }

  handlePageChanged(page?: number) {
    this.searchProject(this.searchCondition, page).subscribe();
    this.getUsersByProjectId(this.projectId).subscribe();
  }

  handleClickDetail(todoId: string) {
    const getTodoObservable$ = this.todoService.getTodo(this.projectId, todoId);
    const getGroupListObservable$ = this.todoService.getUsersByProjectId(this.projectId);
    forkJoin([getTodoObservable$, getGroupListObservable$])
      .pipe(
        tap(([todo, users]) => {
          // this.todo = todo;
          // this.users = users;
          this.bsModalRef = this.bsModalService.show(DetailModalComponent, {
            animated: true,
            backdrop: 'static',
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              todo: todo,
              // users: this.users,
            },
          });
          this.bsModalRef.onHidden?.subscribe(() => {
            this.handlePageChanged();
          });
        }),
        catchError((error) => {
          this.dialogService.openOkDialog('Todo情報の取得に失敗しました。');
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe();
  }

  private getUsersByProjectId(projectId: string) {
    return this.todoService.getUsersByProjectId(projectId).pipe(
      tap((users) => {
        this.searchUsers = users.map((user) => ({
          id: user.id,
          name: user.name,
        }));
      }),
      catchError((error) => {
        this.dialogService.openOkDialog('ユーザー情報の取得に失敗しました。');
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.hide();
      }),
    );
  }

  private searchProject(
    searchCondition?: SearchTodoCondition,
    page?: number,
  ): Observable<TodoSearchResponse> {
    this.loadingService.show();
    return this.todoService.postTodoSearch(this.projectId, searchCondition, page).pipe(
      tap((res) => {
        this.todos = res.items;
        this.totalItems = res.pagination.totalItems;
      }),
      catchError((error) => {
        this.dialogService.openOkDialog('Todoの検索に失敗しました。');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide()),
    );
  }

  private getProjectIdFromRoute(): string {
    for (const route of this.route.pathFromRoot) {
      const projectId = route.snapshot.paramMap.get('projectId');
      if (projectId) {
        return projectId;
      }
    }

    return '';
  }
}
