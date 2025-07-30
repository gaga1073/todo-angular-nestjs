import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { catchError, EMPTY } from 'rxjs';
import { passwordMatchValidator } from 'src/app/core/validators/passwordMatchValidator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  signupForm = new FormGroup(
    {
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.minLength(8)] }),
    },
    { validators: passwordMatchValidator },
  );

  private readonly authenticationService = inject(AuthenticationService);

  onSubmit(): void {
    this.authenticationService.signup(this.signupForm.getRawValue()).pipe(
      catchError((error) => {
        console.error(error);
        return EMPTY;
      }),
    );
  }
}
