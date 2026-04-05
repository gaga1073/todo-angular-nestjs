import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogComponent } from './dialog.component';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly bsModalService = inject(BsModalService);

  bsModalRef?: BsModalRef;
  subject = new Subject<boolean>();

  openConfirmDialog(message: string): Observable<boolean> {
    this.bsModalRef = this.bsModalService.show(DialogComponent, {
      initialState: {
        modalType: 'COMFIRM',
        message: message,
      },
      animated: true,
      backdrop: 'static',
      class: 'modal-md',
    });

    return this.subject.asObservable();
  }

  openOkDialog(message: string): BsModalRef<unknown> {
    this.bsModalRef = this.bsModalService.show(DialogComponent, {
      initialState: {
        modalType: 'OK',
        message: message,
      },
      animated: true,
      backdrop: 'static',
      class: 'modal-md',
    });
    return this.bsModalRef;
  }
}
