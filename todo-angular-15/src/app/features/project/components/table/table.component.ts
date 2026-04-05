import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { catchError, throwError, finalize } from 'rxjs';
import { ProjectService } from '@/features/project/services/project.service';
import { ProjectListModel } from '@/core/types/project.type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly loadingService = inject(LoadingService);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  @Input() currentPage = 1;
  @Input() itemPerPage = 10;
  @Input() totalItems!: number;
  @Input() projects!: ProjectListModel[];

  @Output() readonly handelPageChanged = new EventEmitter<number>();
  @Output() readonly handleClickDetail = new EventEmitter<string>();

  editingProjectId: string | null = null;
  editingName = '';

  editingDescription = '';

  private removeProject(projectId: string) {
    this.projects = this.projects.filter((project) => project.id !== projectId);
  }

  ngOnInit(): void {
    return;
  }

  onEditClick(projectId: string) {
    // this.handleClickDetail.emit(projectId);
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      this.editingProjectId = projectId;
      this.editingName = project.name;
      this.editingDescription = project.description;
    }
  }

  onPageChanged(event: PageChangedEvent) {
    this.currentPage = event.page;
    if (this.projects.length !== 0) {
      this.handelPageChanged.emit(event.page);
    }
  }

  onDeleteClick(projectId: string) {
    this.dialogService
      .openConfirmDialog('プロジェクト情報を削除しますか？')
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.loadingService.show();
        this.projectService
          .deleteProject(projectId)
          .pipe(
            catchError((error) => {
              this.dialogService.openOkDialog('プロジェクト情報の削除に失敗しました。');
              return throwError(() => error);
            }),
            finalize(() => this.loadingService.hide()),
          )
          .subscribe(() => {
            this.removeProject(projectId);
            this.dialogService.openOkDialog('プロジェクト情報を削除しました。');
          });
      });
  }

  onSaveClick(projectId: string) {
    if (!this.editingName.trim()) return;
    if (!this.editingDescription.trim()) return;

    this.loadingService.show();

    this.projectService
      .patchProject(projectId, { name: this.editingName, description: this.editingDescription })
      .pipe(finalize(() => this.loadingService.hide()))
      .subscribe({
        next: (updated) => {
          const project = this.projects.find((p) => p.id === projectId);
          if (project) {
            project.name = updated.name;
            project.description = updated.description;
          }
          this.editingProjectId = null;
        },
        error: () => {
          this.dialogService.openOkDialog('プロジェクト情報の更新に失敗しました。');
        },
      });
    this.editingProjectId = null;
  }

  onCancelClick() {
    this.editingProjectId = null;
    this.editingName = '';
  }

  onRowClick(projectId: string) {
    this.router.navigate([`/projects/${projectId}/todos`]);
  }
}
