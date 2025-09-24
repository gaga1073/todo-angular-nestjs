import { inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { Router } from '@angular/router';
import { ACCESS_TOKEN_KEY } from '@/core/constants/common';
import { SessionStorageService } from '@/core/services/session-storage.service';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  private isRefreshing = new BehaviorSubject<boolean>(false);

  /**
   * インターセプター関数
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = this.attachAccessToken(request);

    return this.handleRequest({
      request: clonedRequest,
      next: next,
    });
  }

  /**
   * セッションストレージにアクセストークンを保存
   */
  private attachAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    const accessToken = this.sessionStorageService?.getItem(ACCESS_TOKEN_KEY);
    if (accessToken) {
      return request.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return request;
  }

  /**
   * リクエストのハンドラー
   */
  private handleRequest(parameters: {
    request: HttpRequest<unknown>;
    next: HttpHandler;
  }): Observable<HttpEvent<unknown>> {
    return parameters.next.handle(parameters.request).pipe(
      catchError((errorResponse: HttpErrorResponse) => {
        if (parameters.request.url.includes('/auth/refresh-token')) {
          return throwError(() => errorResponse);
        }

        if (errorResponse.status === 401) {
          if (!this.isRefreshing.getValue()) {
            return this.handleTokenRefresh(parameters);
          }

          return this.waitForTokenRefresh(parameters);
        }

        return throwError(() => errorResponse);
      }),
    );
  }

  /**
   * リフレッシュトークンでアクセストークンを再取得
   */
  private handleTokenRefresh(parameters: {
    request: HttpRequest<unknown>;
    next: HttpHandler;
  }): Observable<HttpEvent<unknown>> {
    this.isRefreshing.next(true);
    return this.authenticationService.refreshToken().pipe(
      switchMap(() => {
        this.isRefreshing.next(false);
        return this.retryRequestWithRefreshedToken(parameters);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isRefreshing.next(false);
        return throwError(() => error);
      }),
    );
  }

  /**
   * 複数リクエスト時に後続のリクエストを待機する
   * isRefreshingを監視してtrueになったらリトライ処理を実施
   */
  private waitForTokenRefresh(parameters: {
    request: HttpRequest<unknown>;
    next: HttpHandler;
  }): Observable<HttpEvent<unknown>> {
    return this.isRefreshing.pipe(
      filter((refreshing) => !refreshing),
      take(1),
      switchMap(() => this.retryRequestWithRefreshedToken(parameters)),
    );
  }

  /**
   * リトライ処理
   * 元々のリクエストオブジェクトに新しいアクセストークンを付与して複製
   * 複製後のリクエストを返却
   */
  private retryRequestWithRefreshedToken(parameters: {
    request: HttpRequest<unknown>;
    next: HttpHandler;
  }): Observable<HttpEvent<unknown>> {
    const refreshedToken = this.sessionStorageService.getItem(ACCESS_TOKEN_KEY);
    const clonedRequest = refreshedToken
      ? parameters.request.clone({
          setHeaders: { Authorization: `Bearer ${refreshedToken}` },
        })
      : parameters.request;
    return parameters.next.handle(clonedRequest);
  }
}
