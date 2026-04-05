import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchTodoCondition } from '@/features/todo/pages/todo-detail/todo-detail.component';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss'],
})
export class SearchAreaComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Input() searchUsers!: { id: string; name: string }[];

  @Output() pageSearch = new EventEmitter<SearchTodoCondition>();

  todoSearchForm = this.formBuilder.nonNullable.group({
    title: [''],
    status: ['all'],
    dueDate: [''],
    assigneeUserId: ['all'],
    createUserId: ['all'],
  });

  get title() {
    return this.todoSearchForm.get('title');
  }
  get status() {
    return this.todoSearchForm.get('status');
  }
  get dueDate() {
    return this.todoSearchForm.get('dueDate');
  }
  get assigneeUserId() {
    return this.todoSearchForm.get('assigneeUserId');
  }
  get createUserId() {
    return this.todoSearchForm.get('createUserId');
  }

  onSubmit(): void {
    const title = this.todoSearchForm.getRawValue().title;
    const status = this.todoSearchForm.getRawValue().status;
    const dueDate = this.todoSearchForm.getRawValue().dueDate;
    const assigneeUserId = this.todoSearchForm.getRawValue().assigneeUserId;
    const createUserId = this.todoSearchForm.getRawValue().createUserId;

    const titleValue = title === '' ? undefined : title;
    const statusValue = status === 'all' ? undefined : status;
    const dueDateValue = dueDate === '' ? undefined : dueDate;
    const assigneeUserIdValue = assigneeUserId === 'all' ? undefined : assigneeUserId;
    const createUserIdValue = createUserId === 'all' ? undefined : createUserId;

    this.pageSearch.emit({
      title: titleValue,
      status: statusValue,
      dueDate: dueDateValue,
      assigneeUserId: assigneeUserIdValue,
      createUserId: createUserIdValue,
    });
  }
}
