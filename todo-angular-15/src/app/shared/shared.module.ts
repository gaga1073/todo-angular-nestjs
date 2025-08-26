import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { ToastComponent } from './toast/toast.component';
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [HeaderComponent, ToastComponent],
  imports: [CommonModule, AlertModule],
  exports: [HeaderComponent, ToastComponent],
})
export class SharedModule {}
