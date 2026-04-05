import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchCondition } from '@/features/user/pages/user-list/user-list.component';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss'],
})
export class SearchAreaComponent {
  private readonly formBuilder = inject(FormBuilder);

  @Output() pageSearch = new EventEmitter<SearchCondition>();

  userSearchForm = this.formBuilder.nonNullable.group({
    name: [''],
    role: ['all'],
    isActive: ['all'],
  });

  get name() {
    return this.userSearchForm.get('name');
  }
  get role() {
    return this.userSearchForm.get('role');
  }
  get isActive() {
    return this.userSearchForm.get('isActive');
  }

  onSubmit(): void {
    const name = this.userSearchForm.getRawValue().name;
    const role = this.userSearchForm.getRawValue().role;
    const isActive = this.userSearchForm.getRawValue().isActive;

    const nameValue = name === '' ? undefined : name;
    const roleValue = role === 'all' ? undefined : role;
    const isActiveValue = isActive === 'all' ? undefined : isActive === 'active';

    this.pageSearch.emit({ name: nameValue, role: roleValue, isActive: isActiveValue });
  }
}
