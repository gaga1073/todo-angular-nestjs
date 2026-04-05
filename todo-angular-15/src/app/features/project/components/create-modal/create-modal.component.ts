import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { finalize } from 'rxjs';
import { MemberSelectionService } from '@/features/group/services/member-selection.service';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);
  readonly memberSelectionService = inject(MemberSelectionService);

  @Input() readonly groups!: { id: string; name: string }[];

  createForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      description: ['', []],
      groupId: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get name() {
    return this.createForm.get('name');
  }
  get description() {
    return this.createForm.get('description');
  }
  get groupId() {
    return this.createForm.get('groupId');
  }

  ngOnInit(): void {
    // this.selectionUserList = this.usersList.map((user) => ({ id: user.id, name: user.name }));
    // this.createForm.patchValue({
    //   members: this.selectionUserList,
    // });
  }

  onClickClose() {
    this.bsModalRef?.hide();
  }

  onSubmit(): void {
    this.loadingService.show();

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.loadingService.hide();
      return;
    }

    const payload = {
      name: this.createForm.getRawValue().name,
      description: this.createForm.getRawValue().description,
      groupId: this.createForm.getRawValue().groupId,
    };

    this.projectService
      .postProject(payload)
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
