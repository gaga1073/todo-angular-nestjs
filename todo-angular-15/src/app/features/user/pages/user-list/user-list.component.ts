import { getEndpoints } from '@/core/constants/endpoints.constant';
import { DialogService } from '@/shared/dialog/dialog.service';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '@/features/user/services/user.service';
import { User } from '@/core/types/user-response.type';
import { LoadingService } from '@/shared/loading/loading.service';
import { ApiService } from '@/core/services/api.service';

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

  // searchConditionSubject = new BehaviorSubject<SearchCondition>({ currentPage: 1 });

  // searchCondition$ = this.searchConditionSubject.asObservable();

  users: User[] = [];
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
    this.fetchUser(searchCondition, page);
  }

  handlePageChanged(page?: number) {
    this.fetchUser(this.searchCondition, page);
  }

  private fetchUser(searchCondition?: SearchCondition, page?: number) {
    this.userService.postUsersSearch(searchCondition, page).subscribe({
      next: (res) => {
        this.users = res?.users;
        this.totalItems = res?.pagenation.totalItems;
      },
      error: (err) => {
        throw err;
      },
    });
  }
}
