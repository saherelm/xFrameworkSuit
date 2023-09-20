import {
  XTask,
  toBoolean,
  isNullOrUndefined,
  XModelKeyProvider,
  XModelValueProvider,
  isNullOrEmptyString,
  XBaseDataPagerQuery,
  XBaseDataPagerQueryResult,
} from 'x-framework-core';
import {
  XPageLoadingEvent,
  XDataScrollerAction,
  XDataScrollerActionModel,
} from 'x-framework-components';
import { map } from 'rxjs/operators';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getTaskName } from '../tools/task.tools';
import { VPageComponent } from '../v-page/v-page.component';
import { XQueryDto, XQueryResultDto } from '../models/x-query.dto';

@Component({
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export abstract class VBaseDataScrollerPage<T> extends VPageComponent {
  //
  //#region Props ...
  private loaderEvent: any;

  //
  canNext: boolean;
  abstract showSearch: boolean;

  //
  showPageRefresher = true;
  showPageInfinityScroller = true;

  //
  // XQueryDto ...
  canSearch: boolean;
  isAscending = true;
  enableTracking = false;
  containsDetail = false;
  sortOrder: keyof Partial<T>;

  //
  dataScrollerQuery: XBaseDataPagerQuery = {
    filter: '',
    pageNumber: 1,
    rowsInPage: this.config.defaultPageSize,
  };
  dataScrollerResult: XBaseDataPagerQueryResult<T>;
  dataScrollerActionProvider = new Subject<XDataScrollerActionModel>();
  //#endregion

  //
  //#region Abstract ...
  //
  abstract DataScrollerTaskName: string;
  abstract hiddenModelKeys: Array<keyof Partial<T>>;
  abstract availableModelKeys: Array<keyof Partial<T>>;
  abstract sortOrderModelKeys: Array<keyof Partial<T>>;

  //
  abstract modelKeyProvider: XModelKeyProvider<T>;
  abstract modelValueProvider: XModelValueProvider<T>;

  //
  abstract getTaskNames(): string[];
  abstract queryFetcherTask(query: XQueryDto): Observable<XQueryResultDto<T>>;
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region Register Handlers ...
  registerViewHandlers() {
    //
    // Register on DataScroller Action provider ...
    this.applyTakeUntilWrapper(
      this.dataScrollerActionProvider.asObservable()
      // tslint:disable-next-line: deprecation
    ).subscribe((model) => {
      //
      if (!model) {
        return;
      }

      //
      if (model.action === XDataScrollerAction.CanNext) {
        //
        this.canNext = toBoolean(model.payload);
        this.detectChanges();
      }
    });
  }
  //#endregion

  //
  //#region Task Handlers ...
  async onTaskStart(name: string, task: XTask<any>) {
    super.onTaskStart(name, task);
    console.log('onTaskStart: ', name, task);

    //
    if (this.isPageTask(name)) {
      await this.setLoadingState(true);
    }
  }

  async onTaskFinished(name: string, task: XTask<any>) {
    super.onTaskFinished(name, task);
    console.log('onTaskFinished: ', name, task);

    //
    if (this.isPageTask(name)) {
      //
      await this.setLoadingState(false);

      //
      if (name !== this.DataScrollerTaskName) {
        this.showSuccess();
      }

      //
      // Load All Models ...
      if (name === this.DataScrollerTaskName) {
        await this.handleDataScrollerTaskFinished(task.result);
      }
    }
  }

  async onTaskFailed(name: string, task: XTask<any>) {
    super.onTaskFailed(name, task);
    console.log('onTaskFailed: ', name, task);

    //
    if (this.isPageTask(name)) {
      //
      await this.setLoadingState(false);
      this.showError(task.error);
    }
  }
  //#endregion

  //
  //#region UI Providers ...
  queryFetcher = (q: XBaseDataPagerQuery) => {
    //
    const apiQuery = this.toXQuery(q);
    return this.applyToDataScrollerQueryResult(this.queryFetcherTask(apiQuery));
    // tslint:disable-next-line: semicolon
  };

  trackByFn(index: number, item: T) {
    return index;
  }
  //#endregion

  //
  //#region UI Handlers ...
  handleLoadMorePage(event: XPageLoadingEvent) {
    //
    if (!this.canNext) {
      //
      this.loaderEvent = null;
      this.cancelLoading(event.event);
      return;
    }

    //
    this.loaderEvent = event.event;
    this.dataScrollerActionProvider.next({
      action: XDataScrollerAction.LoadMore,
    });
  }

  handleResetDataScrollerQuery() {
    //
    this.dataScrollerQuery = {
      filter: '',
      pageNumber: 1,
      rowsInPage: this.config.defaultPageSize,
    };

    //
    this.dataScrollerActionProvider.next({
      action: XDataScrollerAction.ClearItems,
    });

    //
    this.detectChanges();
  }

  handleRefreshPage(event: XPageLoadingEvent) {
    //
    this.loaderEvent = event.event;
    this.handleResetDataScrollerQuery();
  }

  handleDataScrollerQueryChanged(query: XBaseDataPagerQuery) {
    //
    this.dataScrollerQuery = {
      ...query,
    };
  }

  handleSearchbarQuryChanged(query: string) {
    //
    this.dataScrollerQuery = {
      ...this.dataScrollerQuery,
      filter: query,
    };

    //
    this.detectChanges();
  }

  async handleDataScrollerTaskReady(
    task: Observable<XBaseDataPagerQueryResult<T>>
  ) {
    //
    // XBaseDataPagerQueryResult<any> ...
    if (!task || this.uiDisabled || this.isLoading) {
      return;
    }

    //
    await this.issueDataScrollerTask(task);
  }
  //#endregion

  //
  //#region Actions ...
  protected isPageTask(key: string | any) {
    //
    const pageTasks = this.getTaskNames();
    const mTaskKey = getTaskName(key);
    const result = pageTasks.includes(mTaskKey);

    //
    return result;
  }
  //#endregion

  //
  //#region Private ...
  private toXQuery(q: XBaseDataPagerQuery) {
    return {
      filter: q.filter,
      containsDetail: this.containsDetail,
      enableTracking: this.enableTracking,
      sortBy: this.sortOrder,
      isAscending: this.isAscending,
      page: q.pageNumber,
      pageSize: q.rowsInPage,
    } as XQueryDto;
  }

  private applyToDataScrollerQueryResult(
    result: Observable<XQueryResultDto<T>>
  ) {
    return result.pipe(
      // tslint:disable-next-line: no-shadowed-variable
      map((result) => {
        return {
          count: result.totalItems || 0,
          items: result.items || [],
        } as XBaseDataPagerQueryResult<T>;
      })
    );
  }

  private async issueDataScrollerTask(
    task: Observable<XBaseDataPagerQueryResult<T>>
  ): Promise<void> {
    //
    const mTaskName = this.DataScrollerTaskName;
    const mTask = task;

    //
    await this.addOrUpdateTask({
      priority: 0,
      affectLoading: true,
      name: mTaskName,
      task: mTask,
    });

    //
    await this.dispatchTask(mTaskName);

    //
    if (!isNullOrUndefined(this.loaderEvent)) {
      this.cancelLoading(this.loaderEvent);
    }
  }

  private async handleDataScrollerTaskFinished(
    result: XBaseDataPagerQueryResult<T>
  ) {
    //
    this.dataScrollerResult = null;
    this.detectChanges();

    //
    if (!result) {
      return;
    }

    //
    this.dataScrollerResult = {
      ...result,
    };

    //
    this.canSearch =
      (this.hasChild(this.dataScrollerResult.items) &&
        this.dataScrollerResult.items.length > 1) ||
      !isNullOrEmptyString(this.dataScrollerQuery.filter);

    //
    this.detectChanges();
  }
  //#endregion
}
