import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { authenticationGuard } from '@/core/guards/authentication.guard';

const routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
