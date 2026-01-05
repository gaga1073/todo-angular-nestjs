import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { AUTHENTICATION_URLs } from '@/core//constants/path.constant';

export const authenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);

  const router = inject(Router);

  let isLogin = false;

  authenticationService.isLogin$.subscribe({
    next: (value) => {
      isLogin = value;
    },
  });

  if (isLogin) {
    return true;
  }

  return router.createUrlTree([AUTHENTICATION_URLs.login]);
};
