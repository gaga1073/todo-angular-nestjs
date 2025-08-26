import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { TodoRoutingModule } from './todo-routing.module';

import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, TodoRoutingModule, AlertModule],
})
export class TodoModule {}
