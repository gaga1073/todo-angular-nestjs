import { GROUP_PATHS } from '@/core/constants/path.constant';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './pages/group-list/group-list.component';
import { authenticationGuard } from '@/core/guards/authentication.guard';

const routes: Routes = [
  {
    path: GROUP_PATHS.list,
    component: GroupListComponent,
    canActivate: [authenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupRoutingModule {}
