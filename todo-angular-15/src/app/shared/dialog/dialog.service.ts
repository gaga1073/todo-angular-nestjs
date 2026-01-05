import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { DialogComponent } from './dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  bsModalRef?: BsModalRef;

  private readonly bsModalService = inject(BsModalService);

  openConfirmDialog(message: string): BsModalRef<any> {
    this.bsModalRef = this.bsModalService.show(DialogComponent, {
      initialState: {
        modalType: 'COMFIRM',
        message: message,
      },
      animated: true,
      backdrop: 'static',
      class: 'modal-md',
    });

    return this.bsModalRef;
  }

  openOkDialog(message: string): BsModalRef<any> {
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
