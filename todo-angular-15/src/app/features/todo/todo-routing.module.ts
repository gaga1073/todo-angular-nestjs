import { TODO_PATHS } from '@/core/constants/path.constant';
import { authenticationGuard } from '@/core/guards/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  { path: TODO_PATHS.home, component: HomeComponent, canActivate: [authenticationGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
