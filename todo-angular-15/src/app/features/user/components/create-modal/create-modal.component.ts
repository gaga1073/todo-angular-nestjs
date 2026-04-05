import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@/features/user/services/user.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { finalize } from 'rxjs';
import { UserRole } from '@/core/types/user.type';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);

  createForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      // role: this.formBuilder.nonNullable.control<UserRole>('admin', [Validators.required]),
      isActive: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get name() {
    return this.createForm.get('name');
  }
  get role() {
    return this.createForm.get('role');
  }
  get email() {
    return this.createForm.get('email');
  }
  get password() {
    return this.createForm.get('password');
  }
  get confirmPassword() {
    return this.createForm.get('confirmPassword');
  }

  ngOnInit(): void {
    this.createForm.patchValue({});
  }

  onClickClose() {
    this.bsModalRef?.hide();
  }

  onSubmit(): void {
    this.loadingService.show();

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.loadingService.hide();
    }

    const payload = {
      name: this.createForm.getRawValue().name,
      email: this.createForm.getRawValue().email,
      role: this.createForm.getRawValue().role as UserRole,
      password: this.createForm.getRawValue().password,
    };

    this.userService
      .postUser(payload)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe({
        next: () => {
          this.onClickClose();
        },
        error: () => {
          this.dialogService.openOkDialog('作成に失敗しました。');
        },
      });
  }
}
