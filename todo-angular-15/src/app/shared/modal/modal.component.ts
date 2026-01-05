import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  constructor(private bsModalRef: BsModalRef) {}

  onClose() {
    this.bsModalRef.hide();
  }

  onClick() {
    this.bsModalRef.hide();
  }
}
