import { Todo } from '@/core/types/home-response.type';
import { AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-detail-modal',
  templateUrl: './detail-modal.component.html',
  styleUrls: ['./detail-modal.component.scss'],
})
export class DetailModalComponent implements OnInit, AfterViewChecked {
  constructor(public bsModalRef: BsModalRef) {}

  @Input() todo!: Todo;

  selectedValue = 'noStarted';

  isTitleFocused = false;

  isEditingTitle = false;
  isEditingDetail = false;

  isEdited = false;
  isClicking = false;

  title = '';
  detail = '';

  originText = '';

  @ViewChild('titleInput') titleInput?: ElementRef<HTMLInputElement>;
  @ViewChild('detailTextarea') detailTextarea?: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.title = this.todo.title;
    this.detail = this.todo.description;
  }

  ngAfterViewChecked(): void {
    if (this.isEditingTitle && this.titleInput) {
      this.titleInput.nativeElement.focus();
    }

    if (this.isEditingDetail && this.detailTextarea) {
      this.detailTextarea.nativeElement.focus();
    }
  }

  onClickClose() {
    this.bsModalRef?.hide();
  }

  onTitleFocus(): void {
    this.isTitleFocused = true;
  }

  onBlurTitle(): void {
    this.isTitleFocused = false;

    this.isEditingTitle = false;
  }

  onClickTitle() {
    this.isEditingTitle = true;
  }

  onFocusDetail(): void {
    if (!this.isEdited) {
      this.originText = this.detail;
    }
    this.isEditingDetail = true;
    this.isEdited = true;
  }

  onBlurDetail(): void {
    if (this.isClicking) return;
    this.isEditingDetail = false;
  }

  onDetailEditCancel(): void {
    this.detail = this.originText;

    this.isClicking = false;
    this.isEditingDetail = false;
    this.isEdited = false;
  }

  onDetailEditSave(): void {
    console.log('保存処理完了');
    this.isClicking = false;
    this.isEditingDetail = false;
    this.isEdited = false;
  }

  getSelectClass(): Record<string, boolean> {
    return {
      'modal__no-starteds-subtle': this.selectedValue === 'noStarted',
      'modal__in-progress-subtle': this.selectedValue === 'InProgress',
      'modal__completed-subtle': this.selectedValue === 'Completed',
    };
  }
}
