import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { UserService } from '@/features/user/services/user.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { BehaviorSubject } from 'rxjs';
import { UserListModel } from '@/core/types/user-response.type';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  @Input() itemPerPage = 10;
  @Input() currentPage = 1;
  @Input() totalItems!: number;
  @Input() users!: UserListModel[];

  @Input() name?: string = undefined;
  @Input() searchConditionSubject!: BehaviorSubject<number>;

  @Output() handelPageChanged = new EventEmitter<number>();
  @Output() handleClickDetail = new EventEmitter<string>();

  bsModalRef?: BsModalRef;
  pagedUsers: typeof this.users = [];

  private readonly bsModalService = inject(BsModalService);
  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);

  ngOnInit(): void {
    return;
  }

  onEditClick(userId: string) {
    this.handleClickDetail.emit(userId);
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    if (this.users.length !== 0) {
      this.handelPageChanged.emit(event.page);
    }
  }
}
