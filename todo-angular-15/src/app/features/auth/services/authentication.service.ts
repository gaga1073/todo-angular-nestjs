import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { getEndpoints } from 'src/app/core/constants/endpoints.constant';
import { LoginRequest } from '../types/login-request.type';
import { SignupRequest } from '../types/signup-request.type';
import { SignupResponse } from '../types/signup-response.type';
import { User } from '../types/user.type';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';
import { ACCESS_TOKEN_KEY } from 'src/app/core/constants/common';
import { LoginResponse } from 'src/app/core/types/login-response.type';
import { Router } from '@angular/router';
import { AUTHENTICATION_URLs } from 'src/app/core/constants/path.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly endpoint = getEndpoints();

  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionStorageService = inject(SessionStorageService);

  private readonly accessTokenSubject = new BehaviorSubject(this.sessionStorageService.getItem(ACCESS_TOKEN_KEY));

  readonly isLogin$ = this.accessTokenSubject.asObservable().pipe(map((token) => !!token));

  login(loginRequest: LoginRequest): Observable<User> {
    return this.httpClient
      .post<LoginResponse>(this.endpoint.auth.login, {
        ...loginRequest,
      })
      .pipe(
        map((response: LoginResponse) => {
          const { user, accessToken } = response;
          this.sessionStorageService.setItem(ACCESS_TOKEN_KEY, accessToken);
          this.accessTokenSubject.next(accessToken);
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
          this.sessionStorageService.setItem(ACCESS_TOKEN_KEY, accessToken);
          return user;
        }),
      );
  }

  logOut() {
    this.sessionStorageService.removeItem(ACCESS_TOKEN_KEY);
    this.accessTokenSubject.next(null);
    this.router.navigateByUrl(AUTHENTICATION_URLs.login);
  }
}
