import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { catchError, finalize, throwError } from 'rxjs';
import { GroupListModel } from '@/core/types/group.type';
import { GroupService } from '@/features/group/services/group.service';
import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';

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
  @Input() groups!: GroupListModel[];

  @Output() readonly handelPageChanged = new EventEmitter<number>();
  @Output() readonly handleClickDetail = new EventEmitter<string>();

  private removeGroup(groupId: string) {
    this.groups = this.groups.filter((group) => group.id !== groupId);
  }

  ngOnInit(): void {
    return;
  }

  onEditClick(groupId: string) {
    this.handleClickDetail.emit(groupId);
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    if (this.groups.length !== 0) {
      this.handelPageChanged.emit(event.page);
    }
  }

  onDeleteClick(groupId: string) {
    this.dialogService.openConfirmDialog('グループ情報を削除しますか？').subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.loadingService.show();
      this.groupService
        .deleteGroup(groupId)
        .pipe(
          catchError((error) => {
            this.dialogService.openOkDialog('グループ情報の削除に失敗しました。');
            return throwError(() => error);
          }),
          finalize(() => this.loadingService.hide()),
        )
        .subscribe(() => {
          this.removeGroup(groupId);
          this.dialogService.openOkDialog('グループ情報を削除しました。');
        });
    });
  }
}
