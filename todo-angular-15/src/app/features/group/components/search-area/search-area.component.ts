import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchGroupCondition } from '@/features/group/pages/group-list/group-list.component';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss'],
})
export class SearchAreaComponent {
  private readonly formBuilder = inject(FormBuilder);

  name?: string;
  @Output() pageSearch = new EventEmitter<SearchGroupCondition>();

  userSearchForm = this.formBuilder.nonNullable.group({
    name: [''],
  });

  onSubmit(): void {
    const name = this.userSearchForm.getRawValue().name;

    const nameValue = name === '' ? undefined : name;

    this.pageSearch.emit({ name: nameValue });
  }
}
