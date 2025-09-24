import { TODO_URLs } from '@/core/constants/path.constant';
import { ToastService } from '@/shared/toast/toast.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { User } from '@/features/auth/types/user.type';
import { LoadingService } from '@/shared/loading/loading.service';

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
  private readonly loadingService = inject(LoadingService);

  private loading = new BehaviorSubject<boolean>(false);

  loading$ = this.loading.asObservable();

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    this.loadingService.show();
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loadingService.hide();
      return;
    }
    this.authenticationService.login(this.loginForm.getRawValue()).subscribe({
      next: (user: User) => {
        this.loadingService.hide();
        this.router.navigateByUrl(TODO_URLs.home);
        return;
      },
      error: () => {
        this.loadingService.hide();
        this.toastService.show('danger', 'メールアドレスまたはパスワードが違います。');
      },
    });
  }
}
