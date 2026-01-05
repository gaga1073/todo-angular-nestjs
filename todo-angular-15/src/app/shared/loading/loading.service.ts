import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type LoadingSize = 'lg' | 'md' | 'sm';

type LoadingOption = {
  size: LoadingSize;
};

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  private sizeSubject = new BehaviorSubject<LoadingSize>('md');
  size$ = this.sizeSubject.asObservable();

  show(option: LoadingOption = { size: 'md' }) {
    this.loadingSubject.next(true);
    this.sizeSubject.next(option.size);
  }
  hide() {
    this.loadingSubject.next(false);
  }
}
