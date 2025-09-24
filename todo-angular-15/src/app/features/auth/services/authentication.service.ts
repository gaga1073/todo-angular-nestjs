import { ACCESS_TOKEN_KEY } from '@/core/constants/common';
import { getEndpoints } from '@/core/constants/endpoints.constant';
import { AUTHENTICATION_URLs } from '@/core/constants/path.constant';
import { SessionStorageService } from '@/core/services/session-storage.service';
import { LoginResponse } from '@/core/types/login-response.type';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from '@/features/auth/types/login-request.type';
import { SignupRequest } from '@/features/auth/types/signup-request.type';
import { SignupResponse } from '@/features/auth/types/signup-response.type';
import { User } from '@/features/auth/types/user.type';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly endpoint = getEndpoints();

  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionStorageService = inject(SessionStorageService);

  private readonly accessTokenSubject = new BehaviorSubject(
    this.sessionStorageService.getItem(ACCESS_TOKEN_KEY),
  );

  readonly isLogin$ = this.accessTokenSubject.asObservable().pipe(map((token) => !!token));

  login(loginRequest: LoginRequest): Observable<User> {
    return this.httpClient
      .post<LoginResponse>(
        this.endpoint.auth.login,
        {
          ...loginRequest,
        },
        { withCredentials: true },
      )
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
      .post<SignupResponse>(
        this.endpoint.auth.signup,
        {
          ...signupRequest,
        },
        { withCredentials: true },
      )
      .pipe(
        map((response: SignupResponse) => {
          const { user, accessToken } = response;
          this.sessionStorageService.setItem(ACCESS_TOKEN_KEY, accessToken);
          return user;
        }),
      );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.httpClient
      .get<LoginResponse>(this.endpoint.auth.refreshToken, { withCredentials: true })
      .pipe(
        map((response: LoginResponse) => {
          const { user, accessToken } = response;
          this.sessionStorageService.setItem(ACCESS_TOKEN_KEY, accessToken);
          this.accessTokenSubject.next(accessToken);
          return response;
        }),
        catchError((err) => {
          this.removeAccessToken();
          this.router.navigateByUrl(AUTHENTICATION_URLs.login);
          return throwError(() => err);
        }),
      );
  }

  logOut() {
    return this.httpClient.get(this.endpoint.auth.logout, { withCredentials: true }).pipe(
      tap(() => {
        this.removeAccessToken();
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
      }),
      catchError((err) => {
        this.removeAccessToken();
        return throwError(() => err);
      }),
    );
  }

  /**
   * アクセストークンを削除
   */
  private removeAccessToken(): void {
    this.sessionStorageService.removeItem(ACCESS_TOKEN_KEY);
    this.accessTokenSubject.next(null);
  }
}
