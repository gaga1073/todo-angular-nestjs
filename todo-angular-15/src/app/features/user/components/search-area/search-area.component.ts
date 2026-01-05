import { LoadingService } from '@/shared/loading/loading.service';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SearchCondition } from '../../pages/user-list/user-list.component';

@Component({
  selector: 'app-search-area',
  templateUrl: './search-area.component.html',
  styleUrls: ['./search-area.component.scss'],
})
export class SearchAreaComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly formBuilder = inject(FormBuilder);

  name?: string;
  @Input() searchConditionSubject!: BehaviorSubject<SearchCondition>;

  @Output() pageSearch = new EventEmitter<SearchCondition>();

  userSearchForm = this.formBuilder.group({
    name: [],
  });

  onSubmit(): void {
    const name = this.userSearchForm.getRawValue().name ?? undefined;

    this.pageSearch.emit({ name: name });
  }
}
