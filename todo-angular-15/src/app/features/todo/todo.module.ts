import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoRoutingModule } from './todo-routing.module';

import { AlertModule } from 'ngx-bootstrap/alert';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TableComponent } from './components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoDetailComponent } from './pages/todo-detail/todo-detail.component';
import { DetailModalComponent } from './components/detail-modal/detail-modal.component';
import { SearchAreaComponent } from './components/search-area/search-area.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';

@NgModule({
  declarations: [
    TableComponent,
    TodoDetailComponent,
    DetailModalComponent,
    SearchAreaComponent,
    CreateModalComponent,
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    AlertModule,
    PaginationModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class TodoModule {}
