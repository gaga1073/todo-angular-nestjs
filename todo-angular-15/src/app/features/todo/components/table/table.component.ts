import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { catchError, finalize, throwError } from 'rxjs';
import { GroupService } from '@/features/group/services/group.service';
import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { TodoModel } from '@/core/types/todo.type';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);

  @Input() currentPage = 1;
  @Input() itemPerPage = 10;
  @Input() totalItems!: number;
  @Input() todos!: TodoModel[];

  @Output() readonly handelPageChanged = new EventEmitter<number>();
  @Output() readonly handleClickDetail = new EventEmitter<string>();

  private removeTodo(todoId: string) {
    this.todos = this.todos.filter((todo) => todo.id !== todoId);
  }

  ngOnInit(): void {
    console.log(this.todos);
    return;
  }

  onEditClick(todoId: string) {
    this.handleClickDetail.emit(todoId);
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    if (this.todos.length !== 0) {
      this.handelPageChanged.emit(event.page);
    }
  }

  onDeleteClick(todoId: string) {
    this.dialogService.openConfirmDialog('Todo情報を削除しますか？').subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.loadingService.show();
      this.groupService
        .deleteGroup(todoId)
        .pipe(
          catchError((error) => {
            this.dialogService.openOkDialog('Todo情報の削除に失敗しました。');
            return throwError(() => error);
          }),
          finalize(() => this.loadingService.hide()),
        )
        .subscribe(() => {
          this.removeTodo(todoId);
          this.dialogService.openOkDialog('Todo情報を削除しました。');
        });
    });
  }
}
