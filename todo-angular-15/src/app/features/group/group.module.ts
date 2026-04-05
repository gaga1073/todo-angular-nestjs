import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupRoutingModule } from './group-routing.module';
import { GroupListComponent } from './pages/group-list/group-list.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { EditModalComponent } from './components/edit-modal/edit-modal.component';
import { SearchAreaComponent } from './components/search-area/search-area.component';
import { TableComponent } from './components/table/table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';

@NgModule({
  declarations: [
    GroupListComponent,
    TableComponent,
    SearchAreaComponent,
    EditModalComponent,
    CreateModalComponent,
  ],
  imports: [
    CommonModule,
    GroupRoutingModule,
    PaginationModule,
    FormsModule,
    BsDropdownModule,
    ReactiveFormsModule,
  ],
})
export class GroupModule {}
