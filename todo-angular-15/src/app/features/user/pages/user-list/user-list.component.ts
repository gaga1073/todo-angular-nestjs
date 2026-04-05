import { DialogService } from '@/shared/dialog/dialog.service';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '@/features/user/services/user.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { UserListModel, UserModel } from '@/core/types/user.type';
import { EditModalComponent } from '@/features/user/components/edit-modal/edit-modal.component';
import { catchError, finalize, forkJoin, tap, throwError } from 'rxjs';
import { CreateModalComponent } from '@/features/user/components/create-modal/create-modal.component';
import { GroupModel } from '@/core/types/group.type';

type ExampleAlertType = { type: string; msg: string };

export type SearchCondition = {
  name?: string;
  role?: string;
  isActive?: boolean;
};

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  private readonly modalService = inject(DialogService);

  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);
  private readonly bsModalService = inject(BsModalService);

  users!: UserListModel[];
  user!: UserModel;
  groups!: GroupModel[];

  totalItems = 0;
  currentPage = 1;

  searchCondition?: SearchCondition;

  bsModalRef?: BsModalRef;

  dismissible = true;
  defaultAlerts: ExampleAlertType[] = [
    {
      type: 'success',
      msg: `You successfully read this important alert message.`,
    },
    {
      type: 'info',
      msg: `This alert needs your attention, but it's not super important.`,
    },
    {
      type: 'danger',
      msg: `Better check yourself, you're not looking too good.`,
    },
  ];
  alerts = this.defaultAlerts;

  ngOnInit(): void {
    this.handlePageChanged();
  }

  // reset(): void {
  //   this.alerts = this.defaultAlerts;
  // }

  // onClosed(dismissedAlert: ExampleAlertType): void {
  //   this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  // }

  onClickCreate() {
    this.bsModalRef = this.bsModalService.show(CreateModalComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-lg modal-dialog-centered',
      initialState: {},
    });

    this.bsModalRef.onHidden?.subscribe(() => {
      this.handlePageChanged();
    });
  }

  handleSearch(searchCondition: SearchCondition) {
    this.searchCondition = searchCondition;

    const page = 1;
    this.searchUser(searchCondition, page).subscribe();
  }

  handlePageChanged(page?: number) {
    this.searchUser(this.searchCondition, page).subscribe();
  }

  handleClickDetail(userId: string) {
    this.loadingService.show();

    forkJoin([this.userService.getUser(userId), this.userService.getGroupsByUserId(userId)])
      .pipe(
        tap(([user, groups]) => {
          this.user = user;
          this.groups = groups;

          this.bsModalRef = this.bsModalService.show(EditModalComponent, {
            animated: true,
            backdrop: 'static',
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              user: this.user,
              groups: this.groups,
            },
          });

          this.bsModalRef.onHidden?.subscribe(() => {
            this.handlePageChanged();
          });
        }),
        catchError((error) => {
          this.modalService.openOkDialog('ユーザー情報の取得に失敗しました。');
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe();
  }

  private searchUser(searchCondition?: SearchCondition, page?: number) {
    this.loadingService.show();
    return this.userService.postUsersSearch(searchCondition, page).pipe(
      tap((res) => {
        this.users = res.items;
        this.totalItems = res.pagination.totalItems;
      }),
      catchError((error) => {
        this.modalService.openOkDialog('ユーザーの検索に失敗しました。');
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.hide();
      }),
    );
  }
}
