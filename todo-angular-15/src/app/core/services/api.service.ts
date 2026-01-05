import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient = inject(HttpClient);

  post<Input, Output>(
    url: string,
    body: Input,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
    },
  ): Observable<Output> {
    return this.httpClient.post<Output>(url, body, {
      withCredentials: true,
      ...options,
    });
  }

  get<Output>(
    url: string,
    options?: {
      headers?: HttpHeaders;
      params?: HttpParams;
    },
  ): Observable<Output> {
    return this.httpClient.get<Output>(url, {
      withCredentials: true,
      ...options,
    });
  }
}
