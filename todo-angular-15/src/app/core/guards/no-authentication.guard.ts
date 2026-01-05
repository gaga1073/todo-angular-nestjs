import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { TODO_URLs } from '@/core/constants/path.constant';
import { CookieService } from 'ngx-cookie-service';

export const noAuthenticationGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthenticationService);
  const cookieService = inject(CookieService);

  const router = inject(Router);

  let isLogin = false;

  authenticationService.isLogin$.subscribe({
    next: (value) => {
      isLogin = value;
    },
  });

  if (isLogin) {
    return router.createUrlTree([TODO_URLs.home]);
  }

  return true;
};
