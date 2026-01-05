import { Todo, TodoStatus } from '@/core/types/home-response.type';
import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DetailModalComponent } from '@/features/todo/components/detail-modal/detail-modal.component';
import { HomeService } from '@/features/todo/services/home.service';
import { TODO_STATUS } from '@/core/constants/common';
import { assertNever } from '@/core/utils/common.util';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  itemPerPage = 10;
  currentPage = 1;

  bsModalRef?: BsModalRef;
  todos: Todo[] = [];
  pagedTodos: typeof this.todos = [];

  private readonly bsModalService = inject(BsModalService);
  private readonly homeService = inject(HomeService);

  ngOnInit(): void {
    this.homeService.todos$.subscribe({
      next: (todos) => {
        this.todos = todos;
        this.updatePage();
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['todos']) {
      this.currentPage = 1; // 初期ページにリセット
      if (this.todos.length !== 0) {
        this.updatePage();
      }
    }
  }

  onDetailClick(todo: Todo) {
    this.bsModalRef = this.bsModalService.show(DetailModalComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-lg',
      initialState: {
        todo: todo,
      },
    });
    return;
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    if (this.todos.length !== 0) {
      this.updatePage();
    }
  }

  mappingStatus(status: TodoStatus) {
    switch (status) {
      case 'NotStarted':
        return TODO_STATUS.noStarted;
      case 'InProgress':
        return TODO_STATUS.InProgress;
      case 'Completed':
        return TODO_STATUS.Completed;
      default:
        return assertNever(status);
    }
  }

  private updatePage() {
    const start = (this.currentPage - 1) * this.itemPerPage;
    const end = start + this.itemPerPage;
    this.pagedTodos = this.todos.slice(start, end);
  }
}
