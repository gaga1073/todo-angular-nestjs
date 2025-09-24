import { AUTHENTICATION_PATHS } from '@/core/constants/path.constant';
import { noAuthenticationGuard } from '@/core/guards/no-authentication.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  {
    path: AUTHENTICATION_PATHS.login,
    component: LoginComponent,
    canActivate: [noAuthenticationGuard],
  },
  { path: AUTHENTICATION_PATHS.signup, component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
