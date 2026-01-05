import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { TodoRoutingModule } from './todo-routing.module';

import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TableComponent } from './components/table/table.component';
import { FormsModule } from '@angular/forms';
import { TodoDetailComponent } from './pages/todo-detail/todo-detail.component';
import { DetailModalComponent } from './components/detail-modal/detail-modal.component';

@NgModule({
  declarations: [HomeComponent, TableComponent, TodoDetailComponent, DetailModalComponent],
  imports: [CommonModule, TodoRoutingModule, AlertModule, PaginationModule, FormsModule],
})
export class TodoModule {}
