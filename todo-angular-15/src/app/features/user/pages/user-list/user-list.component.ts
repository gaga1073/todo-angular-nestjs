import { getEndpoints } from '@/core/constants/endpoints.constant';
import { DialogService } from '@/shared/dialog/dialog.service';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '@/features/user/services/user.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { ApiService } from '@/core/services/api.service';
import { UserListModel, UserModel } from '@/core/types/user-response.type';
import { EditModalComponent } from '@/features/user/components/edit-modal/edit-modal.component';
import { throwError } from 'rxjs';

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

  private readonly apiService = inject(ApiService);
  private readonly endpoint = getEndpoints();

  private readonly userService = inject(UserService);
  private readonly loadingService = inject(LoadingService);
  private readonly bsModalService = inject(BsModalService);

  // searchConditionSubject = new BehaviorSubject<SearchCondition>({ currentPage: 1 });

  // searchCondition$ = this.searchConditionSubject.asObservable();

  users!: UserListModel[];
  user!: UserModel;

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

  reset(): void {
    this.alerts = this.defaultAlerts;
  }

  onClosed(dismissedAlert: ExampleAlertType): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  handleSearch(searchCondition: SearchCondition) {
    this.searchCondition = searchCondition;

    const page = 1;
    this.searchhUser(searchCondition, page);
  }

  handlePageChanged(page?: number) {
    this.searchhUser(this.searchCondition, page);
  }

  handleClickDetail(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (res) => {
        this.user = res;
        this.bsModalRef = this.bsModalService.show(EditModalComponent, {
          animated: true,
          backdrop: 'static',
          class: 'modal-lg modal-dialog-centered',
          initialState: {
            user: this.user,
          },
        });
      },
      error: (err) => {
        throw err;
      },
    });
  }

  private searchhUser(searchCondition?: SearchCondition, page?: number) {
    this.loadingService.show();
    this.userService.postUsersSearch(searchCondition, page).subscribe({
      next: (res) => {
        this.users = res?.users;
        this.totalItems = res?.pagenation.totalItems;
      },
      error: (err) => {
        return throwError(() => err);
      },
      complete: () => {
        this.loadingService.hide();
      },
    });
  }

  private fetchUser(userId: string) {
    this.userService.getUser(userId).subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        // throw err;
      },
    });
  }
}
