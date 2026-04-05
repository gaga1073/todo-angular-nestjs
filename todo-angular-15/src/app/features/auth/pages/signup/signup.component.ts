import { AUTHENTICATION_URLs } from '@/core/constants/path.constant';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { ToastService } from '@/shared/toast/toast.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { DialogService } from '@/shared/dialog/dialog.service';
import { catchError, finalize, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly bsModalService = inject(BsModalService);
  private readonly dialogService = inject(DialogService);

  private readonly loadingService = inject(LoadingService);
  private readonly authenticationService = inject(AuthenticationService);

  isSignupFialure = false;

  signupForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(2), Validators.required]],
      confirmPassword: ['', [Validators.minLength(2), Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get name() {
    return this.signupForm.get('username');
  }
  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get confirmPassword() {
    return this.signupForm.get('confirmPassword');
  }

  onSubmit(): void {
    this.loadingService.show();

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.loadingService.hide();
      return;
    }

    this.authenticationService
      .signup(this.signupForm.getRawValue())
      .pipe(
        switchMap(() => {
          const dialogRef = this.dialogService.openOkDialog('ユーザー登録が成功しました。');
          return dialogRef.onHidden ?? of(void 0);
        }),
        catchError((error) => {
          this.dialogService.openOkDialog('ユーザー登録に失敗しました。');
          return throwError(() => error);
        }),
        finalize(() => this.loadingService.hide()),
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl(AUTHENTICATION_URLs.login);
        },
        error: () => {
          this.isSignupFialure = true;
          this.toastService.show('danger', 'サインアップに失敗しました。');
        },
      });
  }

  onClickReturn(): void {
    this.router.navigateByUrl(AUTHENTICATION_URLs.login);
  }
}
