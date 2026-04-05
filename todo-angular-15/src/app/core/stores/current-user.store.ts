import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, of, tap } from 'rxjs';
import { getEndpoints } from '@/core/constants/endpoints.constant';
import { ApiService } from '@/core/services/api.service';
import { AuthMeResponse } from '@/core/types/auth.type';

@Injectable({ providedIn: 'root' })
export class CurrentUserStore {
  private readonly currentUser = new BehaviorSubject<AuthMeResponse | null>(null);
  private readonly api = inject(ApiService);
  private readonly endpoint = getEndpoints();

  readonly currentUser$ = this.currentUser.asObservable();

  initialize(): Promise<void> {
    return firstValueFrom(
      this.api.get<AuthMeResponse>(this.endpoint.auth.me()).pipe(
        tap((user) => this.set(user)),
        catchError(() => {
          this.clear();
          return of(null);
        }),
        map(() => void 0),
      ),
    );
  }

  set(user: AuthMeResponse | null) {
    this.currentUser.next(user);
  }

  clear() {
    this.currentUser.next(null);
  }

  getOrThrow(): AuthMeResponse {
    const user = this.currentUser.value;
    if (!user) {
      throw new Error('Current user is not set');
    }
    return user;
  }

  get snapshot() {
    return this.currentUser.value;
  }
}
