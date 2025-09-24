import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { AUTHENTICATION_URLs } from '@/core//constants/path.constant';

export const authenticationGuard: CanActivateFn = async () => {
  const authenticationService = inject(AuthenticationService);

  const router = inject(Router);

  const isLogin = await firstValueFrom(authenticationService.isLogin$);

  if (isLogin) {
    return true;
  }

  await router.navigate([AUTHENTICATION_URLs.login]);
  return false;
};
