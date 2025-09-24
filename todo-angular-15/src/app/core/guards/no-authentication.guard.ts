import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { TODO_URLs } from '@/core/constants/path.constant';
import { firstValueFrom } from 'rxjs';

export const noAuthenticationGuard: CanActivateFn = async () => {
  const authenticationService = inject(AuthenticationService);

  const router = inject(Router);

  const isLogin = await firstValueFrom(authenticationService.isLogin$);

  if (isLogin) {
    router.navigateByUrl(TODO_URLs.home);
    return false;
  }

  // await router.navigate([AUTHENTICATION_URLs.login]);
  return true;
};
