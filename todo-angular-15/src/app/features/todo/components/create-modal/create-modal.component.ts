import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { finalize } from 'rxjs';
import { MemberSelectionService } from '@/features/group/services/member-selection.service';
import { TodoService } from '@/features/todo/services/todo.service';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);
  readonly memberSelectionService = inject(MemberSelectionService);

  @Input() readonly users!: { id: string; name: string }[];
  @Input() readonly projectId!: string;

  createForm = this.formBuilder.nonNullable.group(
    {
      title: ['', [Validators.required]],
      status: ['', [Validators.required]],
      description: ['', []],
      assigneeId: ['', [Validators.required]],
      // dueDate: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get title() {
    return this.createForm.get('title');
  }
  get status() {
    return this.createForm.get('status');
  }
  get description() {
    return this.createForm.get('description');
  }
  get assigneeId() {
    return this.createForm.get('assigneeId');
  }
  get dueDate() {
    return this.createForm.get('dueDate');
  }

  ngOnInit(): void {
    return;
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
      title: this.createForm.getRawValue().title,
      status: this.createForm.getRawValue().status,
      description: this.createForm.getRawValue().description,
      assigneeId: this.createForm.getRawValue().assigneeId,
      // dueDate: this.createForm.getRawValue().dueDate,
      dueDate: new Date().toISOString(), // TODO: 仮の値
    };

    this.todoService
      .postTodo(this.projectId, payload)
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
