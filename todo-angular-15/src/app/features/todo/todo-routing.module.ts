import { TODO_PATHS } from '@/core/constants/path.constant';
import { authenticationGuard } from '@/core/guards/authentication.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoDetailComponent } from './pages/todo-detail/todo-detail.component';

const routes: Routes = [
  { path: '', component: TodoDetailComponent, canActivate: [authenticationGuard] },
  {
    path: `${TODO_PATHS.detail}/:todoId`,
    component: TodoDetailComponent,
    canActivate: [authenticationGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
