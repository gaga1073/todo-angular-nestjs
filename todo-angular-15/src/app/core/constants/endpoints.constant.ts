import { inject } from '@angular/core';
import { ENVIRONMENT, Environment } from '@/core/token/environment.token';

export const getEndpoints = () => {
  const environment = inject<Environment>(ENVIRONMENT);
  return {
    auth: {
      authentication: `${environment.apiBaseUrl}/auth`,
      login: `${environment.apiBaseUrl}/auth/login`,
      refreshToken: `${environment.apiBaseUrl}/auth/refresh-token`,
      signup: `${environment.apiBaseUrl}/auth/signup`,
      logout: `${environment.apiBaseUrl}/auth/logout`,
    },
    user: {
      user: `${environment.apiBaseUrl}/user`,
      sample: `${environment.apiBaseUrl}/user/sample`,
    },
  } as const;
};
