import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, catchError, EMPTY } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  private readonly authenticationService = inject(AuthenticationService);

  private loading = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();

  onSubmit(): void {
    this.authenticationService
      .login(this.loginForm.getRawValue())
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
