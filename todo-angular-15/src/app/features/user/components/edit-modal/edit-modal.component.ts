import { Component, inject, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from '@/features/user//services/user.service';
import { UserModel } from '@/core/types/user.type';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '@/shared/loading/loading.service';
import { finalize } from 'rxjs';
import { DialogService } from '@/shared/dialog/dialog.service';
import { GroupModel } from '@/core/types/group.type';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);

  @Input() user!: UserModel;

  @Input() groups!: GroupModel[];

  editForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    role: ['', [Validators.required]],
    isActive: ['', [Validators.required]],
  });

  get name() {
    return this.editForm.get('name');
  }
  get role() {
    return this.editForm.get('role');
  }
  get isActive() {
    return this.editForm.get('isActive');
  }

  ngOnInit(): void {
    this.editForm.patchValue({
      name: this.user.name,
      role: this.user.role,
      isActive: this.user.isActive ? 'active' : 'stop',
    });
  }

  selectedRole = '';

  onClickClose() {
    this.bsModalRef?.hide();
  }

  onSubmit(): void {
    this.loadingService.show();
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.editForm.getRawValue().name,
      role: this.editForm.getRawValue().role,
      isActive: this.editForm.getRawValue().isActive === 'isAcitve',
    };

    this.userService
      .patchUser(this.user.id, payload)
      .pipe(
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe({
        next: (res) => {
          this.user = res;
          this.onClickClose();
        },
        error: () => {
          this.dialogService.openOkDialog('更新失敗しました。');
        },
      });
  }
}
