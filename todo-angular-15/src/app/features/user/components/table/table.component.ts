import { Todo } from '@/core/types/home-response.type';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DetailModalComponent } from '@/features/todo/components/detail-modal/detail-modal.component';
import { UserService } from '@/features/user/services/user.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { User } from '@/core/types/user-response.type';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() itemPerPage = 10;
  @Input() currentPage = 1;
  @Input() totalItems!: number;
  @Input() users!: User[];

  @Input() name?: string = undefined;
  @Input() searchConditionSubject!: BehaviorSubject<number>;

  @Output() pageChanged = new EventEmitter<number>();

  bsModalRef?: BsModalRef;
  pagedUsers: typeof this.users = [];

  private readonly bsModalService = inject(BsModalService);
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    // this.currentPageSubject.asObservable().subscribe({
    //   next: (currentPage) => (this.currentPage = currentPage),
    // });
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['users']) {
  //     this.currentPage = 1; // 初期ページにリセット
  //     if (this.users.length !== 0) {
  //       this.pageChanged.emit();
  //     }
  //   }
  // }

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
    if (this.users.length !== 0) {
      this.pageChanged.emit(event.page);
    }
  }
}
