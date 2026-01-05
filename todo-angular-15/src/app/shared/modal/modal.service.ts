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
    this.bsModalRef = this.bsModalService.show(ModalComponent, {
      animated: true,
      backdrop: 'static',
      class: 'modal-dialog-centered',
    });
  }
}
