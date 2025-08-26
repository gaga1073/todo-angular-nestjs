import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTHENTICATION_PATHS, TODO_PATHS } from './core/constants/path.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.login}`,
    pathMatch: 'full',
  },
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: () => import('./features/auth/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: TODO_PATHS.base,
    loadChildren: () => import('./features/todo/todo.module').then((m) => m.TodoModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
