import { Component, inject, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { NavigationStart, Router } from '@angular/router';
import { ToastService, ToastAlertType } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  dismissible = true;

  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  private onDesotry$ = new Subject<void>();

  alert: ToastAlertType | null = null;

  ngOnInit(): void {
    this.toastService.alerts$.pipe(takeUntil(this.onDesotry$)).subscribe((alert) => {
      this.alert = alert;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.toastService.close();
      }
    });
  }

  onClosed(): void {
    this.toastService.close();
  }
}
