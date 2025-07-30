import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { getEndpoints } from 'src/app/core/constants/endpoints.constant';
import { LoginRequest } from '../types/login-request.type';
import { SignupRequest } from '../types/signup-request.type';
import { SignupResponse } from '../types/signup-response.type';
import { User } from '../types/user.type';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly endpoint = getEndpoints();

  private readonly httpClient = inject(HttpClient);

  login(loginRequest: LoginRequest): Observable<User> {
    return this.httpClient
      .post<SignupResponse>(this.endpoint.auth.login, {
        ...loginRequest,
      })
      .pipe(
        map((response: SignupResponse) => {
          const { user, accessToken } = response;
          return user;
        }),
      );
  }

  signup(signupRequest: SignupRequest): Observable<User> {
    return this.httpClient
      .post<SignupResponse>(this.endpoint.auth.signup, {
        ...signupRequest,
      })
      .pipe(
        map((response: SignupResponse) => {
          const { user, accessToken } = response;
          return user;
        }),
      );
  }
}
