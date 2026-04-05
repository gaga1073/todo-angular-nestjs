import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectComponent } from './pages/project/project.component';
import { TableComponent } from './components/table/table.component';
import { SearchAreaComponent } from './components/search-area/search-area.component';
import { CreateModalComponent } from './components/create-modal/create-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ProjectRoutingModule } from './project-routing.module';

@NgModule({
  declarations: [ProjectComponent, TableComponent, SearchAreaComponent, CreateModalComponent],
  imports: [
    CommonModule,
    ProjectRoutingModule,
    PaginationModule,
    FormsModule,
    BsDropdownModule,
    ReactiveFormsModule,
    ModalModule,
  ],
})
export class ProjectModule {}
