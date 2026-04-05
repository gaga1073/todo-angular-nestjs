import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AUTHENTICATION_PATHS,
  GROUP_PATHS,
  HOME_PATHS,
  PROJECT_PATHS,
  TODO_PATHS,
  USER_PATHS,
} from './core/constants/path.constant';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${AUTHENTICATION_PATHS.base}/${AUTHENTICATION_PATHS.login}`,
    pathMatch: 'full',
  },
  {
    path: AUTHENTICATION_PATHS.base,
    loadChildren: () =>
      import('./features/auth/authentication.module').then((m) => m.AuthenticationModule),
  },
  {
    path: HOME_PATHS.base,
    loadChildren: () => import('./features/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: USER_PATHS.base,
    loadChildren: () => import('./features/user/user.module').then((m) => m.UserModule),
  },
  {
    path: GROUP_PATHS.base,
    loadChildren: () => import('./features/group/group.module').then((m) => m.GroupModule),
  },
  {
    path: PROJECT_PATHS.base,
    loadChildren: () => import('./features/project/project.module').then((m) => m.ProjectModule),
  },
  {
    path: `${PROJECT_PATHS.base}/:projectId`,
    children: [
      {
        path: `${TODO_PATHS.base}`,
        loadChildren: () => import('./features/todo/todo.module').then((m) => m.TodoModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
