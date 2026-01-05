import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  constructor(private bsModalRef: BsModalRef) {}

  modalType!: 'OK' | 'COMFIRM';
  message!: string;

  onClose() {
    this.bsModalRef.hide();
  }

  onClick() {
    this.bsModalRef.hide();
  }
}
