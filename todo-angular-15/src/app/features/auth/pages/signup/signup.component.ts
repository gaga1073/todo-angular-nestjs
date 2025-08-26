import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { passwordMatchValidator } from 'src/app/core/validators/passwordMatchValidator';
import { Router } from '@angular/router';
import { AUTHENTICATION_URLs } from 'src/app/core/constants/path.constant';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

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

  private readonly authenticationService = inject(AuthenticationService);

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.authenticationService.signup(this.signupForm.getRawValue()).subscribe({
      next: () => {
        this.router.navigateByUrl(AUTHENTICATION_URLs.login);
      },
      error: () => {
        this.isSignupFialure = true;
        alert('ユーザーの作成に失敗しました。');
      },
    });
  }

  onClickReturn(): void {
    this.router.navigateByUrl(AUTHENTICATION_URLs.login);
  }
}
