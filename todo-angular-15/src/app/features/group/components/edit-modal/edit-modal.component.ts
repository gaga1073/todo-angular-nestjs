import { Component, inject, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserModel } from '@/core/types/user.type';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from '@/shared/loading/loading.service';
import { finalize } from 'rxjs';
import { DialogService } from '@/shared/dialog/dialog.service';
import { GroupModel } from '@/core/types/group.type';
import { GroupService } from '@/features/group/services/group.service';
import {
  MemberSelectionService,
  SelectUsersList,
} from '@/features/group/services/member-selection.service';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss'],
})
export class EditModalComponent implements OnInit {
  private readonly groupService = inject(GroupService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly bsModalRef = inject(BsModalRef);
  readonly memberSelectionService = inject(MemberSelectionService);

  @Input() readonly group!: GroupModel;
  @Input() readonly usersList!: SelectUsersList[];
  @Input() readonly users!: UserModel[];

  selectedUsers: SelectUsersList[] = [];
  selectionUserList: SelectUsersList[] = [];

  editForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    description: ['', []],
  });

  get name() {
    return this.editForm.get('name');
  }
  get description() {
    return this.editForm.get('description');
  }

  ngOnInit(): void {
    this.selectedUsers = this.users;
    this.selectionUserList = this.memberSelectionService.excludeSelectionUsers(
      this.usersList,
      this.selectedUsers,
    );

    this.editForm.patchValue({
      name: this.group.name,
      description: this.group.description,
    });
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
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.editForm.getRawValue().name,
      description: this.editForm.getRawValue().description,
      userIds: this.selectedUsers.map((user) => user.id),
    };

    this.groupService
      .patchGroup(this.group.id, payload)
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
          this.dialogService.openOkDialog('更新失敗しました。');
        },
      });
  }
}
