import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-modal',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(private bsModalRef: BsModalRef) {}

  private readonly dialogService = inject(DialogService);

  modalType!: 'OK' | 'COMFIRM';
  message!: string;

  onClose() {
    this.dialogService.subject.next(false);
    this.bsModalRef.hide();
  }

  onClick() {
    this.dialogService.subject.next(true);
    this.bsModalRef.hide();
  }
}
