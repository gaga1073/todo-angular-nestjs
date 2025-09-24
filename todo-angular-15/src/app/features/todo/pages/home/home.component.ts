import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ModalService } from '@/shared/modal/modal.service';

type ExampleAlertType = { type: string; msg: string };
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  private readonly modalService = inject(ModalService);

  private readonly httpClient = inject(HttpClient);

  private readonly endpoint = getEndpoints();

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
    this.httpClient.get<any>(this.endpoint.user.user).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        throw new Error(err);
      },
    });
    this.httpClient.get<any>(this.endpoint.user.sample).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
        throw new Error(err);
      },
    });
  }

  reset(): void {
    this.alerts = this.defaultAlerts;
  }

  onClosed(dismissedAlert: ExampleAlertType): void {
    this.alerts = this.alerts.filter((alert) => alert !== dismissedAlert);
  }

  onModal(): void {
    this.modalService.openConfirmModal();
  }
}
