import { AUTHENTICATION_URLs } from '@/core/constants/path.constant';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { ModalComponent } from '@/shared/modal/modal.component';
import { ToastService } from '@/shared/toast/toast.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from '@/features/auth/services/authentication.service';
import { LoadingService } from '@/shared/loading/loading.service';

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

  private readonly loadingService = inject(LoadingService);

  isSignupFialure = false;

  bsModalRef?: BsModalRef;

  signupForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(2), Validators.required]],
      confirmPassword: ['', [Validators.minLength(2), Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  private readonly authenticationService = inject(AuthenticationService);

  onSubmit(): void {
    this.loadingService.show();

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.loadingService.hide();
      return;
    }

    this.authenticationService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.bsModalRef = this.bsModalService.show(ModalComponent, {
          class: 'modal-dialog-centered',
        });
        this.loadingService.hide();
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
      },
      error: () => {
        this.loadingService.hide();
        this.isSignupFialure = true;
        this.toastService.show('danger', 'サインアップに失敗しました。');
      },
    });
  }

  onClickReturn(): void {
    this.router.navigateByUrl(AUTHENTICATION_URLs.login);
  }
}
