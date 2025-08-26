import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AUTHENTICATION_PATHS } from 'src/app/core/constants/path.constant';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { noAuthenticationGuard } from 'src/app/core/guards/no-authentication.guard';

const routes: Routes = [
  { path: AUTHENTICATION_PATHS.login, component: LoginComponent, canActivate: [noAuthenticationGuard] },
  { path: AUTHENTICATION_PATHS.signup, component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
