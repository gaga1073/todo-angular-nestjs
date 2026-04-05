import { LoadingService } from '@/shared/loading/loading.service';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SearchProjectCondition } from '@/features/project/pages/project/project.component';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss'],
})
export class SearchAreaComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  name?: string;
  // @Input() searchConditionSubject!: BehaviorSubject<SearchCondition>;

  @Output() pageSearch = new EventEmitter<SearchProjectCondition>();

  userSearchForm = this.formBuilder.nonNullable.group({
    name: [''],
  });

  onSubmit(): void {
    const name = this.userSearchForm.getRawValue().name;

    const nameValue = name === '' ? undefined : name;

    this.pageSearch.emit({ name: nameValue });
  }
}
