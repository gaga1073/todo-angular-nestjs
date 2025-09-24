import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalComponent } from './modal/modal.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [HeaderComponent, ToastComponent, ModalComponent, LoadingComponent],
  imports: [CommonModule, AlertModule],
  exports: [HeaderComponent, ToastComponent, LoadingComponent],
})
export class SharedModule {}
