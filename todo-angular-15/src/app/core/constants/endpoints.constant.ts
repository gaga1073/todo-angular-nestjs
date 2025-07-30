import { inject } from '@angular/core';
import { ENVIRONMENT, Environment } from '../token/environment.token';

export const getEndpoints = () => {
  const environment = inject<Environment>(ENVIRONMENT);
  return {
    auth: {
      authentication: `${environment.apiBaseUrl}/auth`,
      login: `${environment.apiBaseUrl}/auth/login`,
      refreshToken: `${environment.apiBaseUrl}/auth/token/refresh`,
      signup: `${environment.apiBaseUrl}/auth/signup`,
    },
    user: {
      user: `${environment.apiBaseUrl}/user`,
    },
  } as const;
};
