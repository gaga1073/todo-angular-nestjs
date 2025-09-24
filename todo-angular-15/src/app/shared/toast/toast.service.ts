import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

type AlertType = 'success' | 'danger' | 'info' | 'warning';

export type ToastAlertType = {
  type: AlertType;
  msg: string;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private alertsSubject = new BehaviorSubject<ToastAlertType | null>(null);
  alerts$ = this.alertsSubject.asObservable();

  show(type: AlertType, msg: string) {
    this.alertsSubject.next({ type: type, msg: msg });
  }

  close() {
    this.alertsSubject.next(null);
  }
}
