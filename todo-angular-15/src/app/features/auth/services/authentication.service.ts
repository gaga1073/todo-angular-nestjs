import { getEndpoints } from '@/core/constants/endpoints.constant';
import { AUTHENTICATION_URLs } from '@/core/constants/path.constant';
import { LoginResponse } from '@/core/types/login-response.type';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  map,
  Observable,
  of,
  tap,
  throwError,
} from 'rxjs';
import { LoginRequest } from '@/features/auth/types/login-request.type';
import { SignupRequest } from '@/features/auth/types/signup-request.type';
import { AuthMe } from '@/core/types/auth-me.type';
import { ApiService } from '@/core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly endpoint = getEndpoints();

  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  private readonly isLogin = new BehaviorSubject(false);

  readonly isLogin$ = this.isLogin.asObservable();

  initialize(): Promise<void> {
    return firstValueFrom(
      this.refreshToken().pipe(
        tap(() => this.setIsLogin(true)),
        catchError(() => {
          this.setIsLogin(false);
          return of(null);
        }),
        map(() => void 0),
      ),
    );
  }

  getAuthMe() {
    return this.apiService.get<AuthMe>(this.endpoint.auth.me).pipe(
      map((response: AuthMe) => {
        return response;
      }),
    );
  }

  setIsLogin(isLogin: boolean) {
    this.isLogin.next(isLogin);
  }

  login(loginRequest: LoginRequest): Observable<void> {
    return this.apiService.post<LoginRequest, void>(this.endpoint.auth.login, loginRequest).pipe(
      map((response) => {
        this.isLogin.next(true);
        return response;
      }),
    );
  }

  signup(signupRequest: SignupRequest): Observable<void> {
    return this.apiService.post<SignupRequest, void>(this.endpoint.auth.signup, signupRequest).pipe(
      map((response) => {
        this.isLogin.next(true);
        return response;
      }),
    );
  }

  refreshToken(): Observable<LoginResponse> {
    return this.apiService.get<LoginResponse>(this.endpoint.auth.refreshToken).pipe(
      map((response) => {
        this.isLogin.next(true);
        return response;
      }),
      catchError((err) => {
        this.isLogin.next(false);
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
        return throwError(() => err);
      }),
    );
  }

  logOut() {
    return this.apiService.get(this.endpoint.auth.logout).pipe(
      tap(() => {
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
      }),
      catchError((err) => {
        return throwError(() => err);
      }),
    );
  }
}
