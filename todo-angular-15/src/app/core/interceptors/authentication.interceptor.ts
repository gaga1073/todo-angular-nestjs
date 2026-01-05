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

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly router = inject(Router);

  private readonly isRefreshing = new BehaviorSubject<boolean>(false);

  /**
   * インターセプター関数
   */
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const clonedRequest = this.attachAccessToken(request);

    const router = inject(Router);

    return this.handleRequest({
      request: request,
      next: next,
    });
  }

  /**
   * セッションストレージにアクセストークンを保存
   */
  // private attachAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
  //   const accessToken = this.sessionStorageService?.getItem(ACCESS_TOKEN_KEY);
  //   if (accessToken) {
  //     return request.clone({
  //       setHeaders: { Authorization: `Bearer ${accessToken}` },
  //     });
  //   }
  //   return request;
  // }

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

        if (parameters.request.url.includes('/auth/me')) {
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
        this.authenticationService.setIsLogin(true);
        // return this.retryRequestWithRefreshedToken(parameters);
        return parameters.next.handle(parameters.request);
      }),
      catchError((error: HttpErrorResponse) => {
        this.isRefreshing.next(false);
        this.authenticationService.setIsLogin(false);
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
      switchMap(() => parameters.next.handle(parameters.request)),
    );
  }

  /**
   * リトライ処理
   * 元々のリクエストオブジェクトに新しいアクセストークンを付与して複製
   * 複製後のリクエストを返却
  //  */
  // private retryRequestWithRefreshedToken(parameters: {
  //   request: HttpRequest<unknown>;
  //   next: HttpHandler;
  // }): Observable<HttpEvent<unknown>> {
  //   const refreshedToken = this.sessionStorageService.getItem(ACCESS_TOKEN_KEY);
  //   const clonedRequest = refreshedToken
  //     ? parameters.request.clone({
  //         setHeaders: { Authorization: `Bearer ${refreshedToken}` },
  //       })
  //     : parameters.request;
  //   return parameters.next.handle(clonedRequest);
  // }
}
