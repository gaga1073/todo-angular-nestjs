import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DialogComponent } from './dialog/dialog.component';
import { LoadingComponent } from './loading/loading.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    ToastComponent,
    DialogComponent,
    LoadingComponent,
    ModalComponent,
  ],
  imports: [CommonModule, AlertModule, BsDropdownModule],
  exports: [HeaderComponent, ToastComponent, LoadingComponent],
})
export class SharedModule {}
