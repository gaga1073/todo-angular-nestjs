import { Component, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ToastAlertType, ToastService } from '../services/toast.service';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
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
        this.toastService;
      }
    });
  }

  onClosed(): void {
    this.alert = null;
  }
}
