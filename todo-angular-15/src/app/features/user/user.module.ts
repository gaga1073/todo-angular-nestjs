import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { TableComponent } from './components/table/table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRolePipe } from '@/core/pipes/user-role.pipe';
import { UserActivationPipe } from '@/core/pipes/user-activation.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SearchAreaComponent } from './components/search-area/search-area.component';

@NgModule({
  declarations: [
    UserListComponent,
    TableComponent,
    UserRolePipe,
    UserActivationPipe,
    SearchAreaComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    PaginationModule,
    FormsModule,
    BsDropdownModule,
    ReactiveFormsModule,
  ],
})
export class UserModule {}
