import { GroupListModel, GroupModel, GroupSearchResponse } from '@/core/types/group.type';
import { LoadingService } from '@/shared/loading/loading.service';
import { DialogService } from '@/shared/dialog/dialog.service';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GroupService } from '@/features/group/services/group.service';
import { catchError, finalize, forkJoin, Observable, tap, throwError } from 'rxjs';
import { UserModel } from '@/core/types/user.type';
import { EditModalComponent } from '@/features/group/components/edit-modal/edit-modal.component';
import { CreateModalComponent } from '@/features/group/components/create-modal/create-modal.component';
import { SearchCondition } from '@/features/user/pages/user-list/user-list.component';

export type SearchGroupCondition = {
  name?: string;
};

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
})
export class GroupListComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly loadingService = inject(LoadingService);
  private readonly bsModalService = inject(BsModalService);
  private readonly dialogService = inject(DialogService);

  groups!: GroupListModel[];
  group!: GroupModel;
  users!: UserModel[];

  totalItems = 0;
  currentPage = 1;

  searchCondition?: SearchCondition;

  bsModalRef?: BsModalRef;

  dismissible = true;

  ngOnInit(): void {
    this.handlePageChanged();
  }

  onClickCreate() {
    this.groupService
      .getUsersList()
      .pipe(
        tap((usersList) => {
          this.bsModalRef = this.bsModalService.show(CreateModalComponent, {
            animated: true,
            backdrop: 'static',
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              usersList: usersList.map((user) => ({ id: user.id, name: user.name })),
            },
          });

          this.bsModalRef.onHidden?.subscribe(() => {
            this.handlePageChanged();
          });
        }),
      )
      .subscribe();
  }

  handleSearch(searchCondition: SearchCondition) {
    this.searchCondition = searchCondition;

    const page = 1;
    this.searchGroup(searchCondition, page).subscribe();
  }

  handlePageChanged(page?: number) {
    this.searchGroup(this.searchCondition, page).subscribe();
  }

  handleClickDetail(groupId: string) {
    const getGroupObservable$ = this.groupService.getGroup(groupId);
    const getUsersByGroupIdObservable$ = this.groupService.getUsersByGroupId(groupId);
    const getUsersListObservable$ = this.groupService.getUsersList();

    forkJoin([getGroupObservable$, getUsersByGroupIdObservable$, getUsersListObservable$])
      .pipe(
        tap(([group, users, usersList]) => {
          this.group = group;
          this.users = users;

          this.bsModalRef = this.bsModalService.show(EditModalComponent, {
            animated: true,
            backdrop: 'static',
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              group: this.group,
              users: this.users,
              usersList: usersList.map((user) => ({ id: user.id, name: user.name })),
            },
          });

          this.bsModalRef.onHidden?.subscribe(() => {
            this.handlePageChanged();
          });
        }),
        catchError((error) => {
          this.dialogService.openOkDialog('グループ情報の取得に失敗しました。');
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe();
  }

  private searchGroup(
    searchCondition?: SearchCondition,
    page?: number,
  ): Observable<GroupSearchResponse> {
    this.loadingService.show();
    return this.groupService.postGroupSearch(searchCondition, page).pipe(
      tap((res) => {
        this.groups = res.items;
        this.totalItems = res.pagination.totalItems;
      }),
      catchError((error) => {
        this.dialogService.openOkDialog('グループの検索に失敗しました。');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
