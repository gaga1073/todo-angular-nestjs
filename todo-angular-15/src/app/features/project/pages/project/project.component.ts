import { CreateModalComponent } from '@/features/project/components/create-modal/create-modal.component';
import { DialogService } from '@/shared/dialog/dialog.service';
import { LoadingService } from '@/shared/loading/loading.service';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { tap, forkJoin, catchError, throwError, finalize, Observable } from 'rxjs';
import { ProjectService } from '@/features/project/services/project.service';
import { ProjectListModel, ProjectModel, ProjectSearchResponse } from '@/core/types/project.type';
import { GroupModel } from '@/core/types/group.type';
import { CurrentUserStore } from '@/core/stores/current-user.store';

export type SearchProjectCondition = {
  name?: string;
};

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly loadingService = inject(LoadingService);
  private readonly bsModalService = inject(BsModalService);
  private readonly dialogService = inject(DialogService);
  private readonly currentUserStore = inject(CurrentUserStore);

  projects!: ProjectListModel[];
  project!: ProjectModel;
  groups!: GroupModel[];

  totalItems = 0;
  currentPage = 1;

  searchCondition?: SearchProjectCondition;

  bsModalRef?: BsModalRef;

  dismissible = true;

  ngOnInit(): void {
    this.handlePageChanged();
  }

  onClickCreate() {
    this.projectService
      .getGroupsByUserId(this.currentUserStore.getOrThrow().id)
      .pipe(
        tap((groups) => {
          this.bsModalRef = this.bsModalService.show(CreateModalComponent, {
            animated: true,
            backdrop: 'static',
            class: 'modal-lg modal-dialog-centered',
            initialState: {
              groups: groups,
            },
          });

          this.bsModalRef.onHidden?.subscribe(() => {
            this.handlePageChanged();
          });
        }),
      )
      .subscribe();
  }

  handleSearch(searchCondition: SearchProjectCondition) {
    this.searchCondition = searchCondition;

    const page = 1;
    this.searchProject(searchCondition, page).subscribe();
  }

  handlePageChanged(page?: number) {
    this.searchProject(this.searchCondition, page).subscribe();
  }

  handleClickDetail(projectId: string) {
    const getProjectObservable$ = this.projectService.getProject(projectId);
    const getGroupListObservable$ = this.projectService.getGroupList();

    forkJoin([getProjectObservable$, getGroupListObservable$])
      .pipe(
        tap(([project, groups]) => {
          this.project = project;
          this.groups = groups;

          // this.bsModalRef = this.bsModalService.show(EditModalComponent, {
          //   animated: true,
          //   backdrop: 'static',
          //   class: 'modal-lg modal-dialog-centered',
          //   initialState: {
          //     project: this.project,
          //     groups: this.groups,
          //   },
          // });

          // this.bsModalRef.onHidden?.subscribe(() => {
          //   this.handlePageChanged();
          // });
        }),
        catchError((error) => {
          this.dialogService.openOkDialog('プロジェクト情報の取得に失敗しました。');
          return throwError(() => error);
        }),
        finalize(() => {
          this.loadingService.hide();
        }),
      )
      .subscribe();
  }

  private searchProject(
    searchCondition?: SearchProjectCondition,
    page?: number,
  ): Observable<ProjectSearchResponse> {
    this.loadingService.show();
    return this.projectService.postProjectSearch(searchCondition, page).pipe(
      tap((res) => {
        this.projects = res.items;
        this.totalItems = res.pagination.totalItems;
      }),
      catchError((error) => {
        this.dialogService.openOkDialog('プロジェクトの検索に失敗しました。');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide()),
    );
  }
}
