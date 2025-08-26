import { TODO_PATHS } from 'src/app/core/constants/path.constant';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { authenticationGuard } from 'src/app/core/guards/authentication.guard';

const routes: Routes = [{ path: TODO_PATHS.home, component: HomeComponent, canActivate: [authenticationGuard] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
