import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { catchError, EMPTY } from 'rxjs';
import { passwordMatchValidator } from 'src/app/core/validators/passwordMatchValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  private formBuilder = inject(FormBuilder);

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
    this.authenticationService
      .signup(this.signupForm.getRawValue())
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        }),
      )
      .subscribe();
  }
}
