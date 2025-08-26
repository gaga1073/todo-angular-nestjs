import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { User } from '../../types/user.type';
import { Router } from '@angular/router';
import { TODO_URLs } from 'src/app/core/constants/path.constant';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService);

  private loading = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authenticationService.login(this.loginForm.getRawValue()).subscribe({
      next: (user: User) => {
        this.router.navigateByUrl(TODO_URLs.home);
        return;
      },
      error: () => {
        this.toastService.show('danger', 'メールアドレスまたはパスワードが違います。');
      },
    });
  }
}
