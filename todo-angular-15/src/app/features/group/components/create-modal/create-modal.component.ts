import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { passwordMatchValidator } from '@/core/validators/passwordMatchValidator';
import { finalize } from 'rxjs';
import { GroupService } from '@/features/group/services/group.service';
import {
  MemberSelectionService,
  SelectUsersList,
} from '@/features/group/services/member-selection.service';

@Component({
  selector: 'app-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);
  readonly memberSelectionService = inject(MemberSelectionService);

  @Input() readonly usersList!: SelectUsersList[];

  selectedUsers: SelectUsersList[] = [];
  selectionUserList: SelectUsersList[] = [];

  createForm = this.formBuilder.nonNullable.group(
    {
      name: ['', [Validators.required]],
      description: ['', []],
      // members: [[] as SelectUsersList[], [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  get name() {
    return this.createForm.get('name');
  }
  get description() {
    return this.createForm.get('description');
  }
  get members() {
    return this.createForm.get('members');
  }

  ngOnInit(): void {
    this.selectionUserList = this.usersList.map((user) => ({ id: user.id, name: user.name }));

    // this.createForm.patchValue({
    //   members: this.selectionUserList,
    // });
  }

  onClickClose() {
    this.bsModalRef?.hide();
  }

  addMember(select: HTMLSelectElement) {
    const userId = select.value;
    this.selectedUsers = this.memberSelectionService.addMember(
      userId,
      this.selectionUserList,
      this.selectedUsers,
    );
    this.selectionUserList = this.memberSelectionService.excludeSelectionUsers(
      this.usersList,
      this.selectedUsers,
    );

    select.value = '';
  }

  removeMember(userId: string) {
    this.selectedUsers = this.memberSelectionService.removeMember(userId, this.selectedUsers);
    this.selectionUserList = this.memberSelectionService.excludeSelectionUsers(
      this.usersList,
      this.selectedUsers,
    );
  }

  onSubmit(): void {
    this.loadingService.show();

    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      this.loadingService.hide();
    }

    const payload = {
      name: this.createForm.getRawValue().name,
      description: this.createForm.getRawValue().description,
      userIds: this.selectedUsers.map((user) => user.id),
    };

    this.groupService
      .postGroup(payload)
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
