import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTHENTICATION_PATHS } from './core/constants/path.constant';

const routes: Routes = [
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: () => import('./features/auth/authentication.module').then((m) => m.AuthenticationModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
