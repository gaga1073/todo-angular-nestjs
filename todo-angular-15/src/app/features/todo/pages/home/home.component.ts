import { Component, inject, OnInit } from '@angular/core';
import { HomeService } from '@/features/todo/services/home.service';
import { Todo } from '@/core/types/home-response.type';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { LoadingService } from '@/shared/loading/loading.service';

type ExampleAlertType = { type: string; msg: string };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly loadingService = inject(LoadingService);

  todos: Todo[] = [];

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
    this.loadingService.show({ size: 'lg' });
    this.homeService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.loadingService.hide();
      },
      error: (err) => {
        this.loadingService.hide();
        throw err;
      },
    });
  }

  reset(): void {
    this.alerts = this.defaultAlerts;
  }

  onClosed(dismissedAlert: ExampleAlertType): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }
}
