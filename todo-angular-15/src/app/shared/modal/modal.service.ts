import { inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  bsModalRef?: BsModalRef;

  private readonly bsModalService = inject(BsModalService);

  openConfirmModal(): void {
    const initialState = {
      config: {
        title: 'アカウント作成完了',
        type: 'OK',
      },
    };

    this.bsModalRef = this.bsModalService.show(ModalComponent, {
      initialState,
      animated: true,
      backdrop: 'static',
      class: 'modal-md',
    });
  }
}
