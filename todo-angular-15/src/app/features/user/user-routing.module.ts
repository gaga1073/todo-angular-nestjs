import { USER_PATHS } from '@/core/constants/path.constant';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { authenticationGuard } from '@/core/guards/authentication.guard';

const routes: Routes = [
  {
    path: USER_PATHS.list,
    component: UserListComponent,
    canActivate: [authenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
