import {
  isSameObject,
  XModelKeyProvider,
  XModelValueProvider,
  isNullOrEmptyString,
  XBaseDataPagerQuery,
  XPartialModelFieldNames,
  XBaseDataPagerQueryResult,
} from 'x-framework-core';
import {
  XListItem,
  XListItemSlideOption,
  XDataPagerPresentType,
  XDataPagerPaginatorPosition,
} from 'x-framework-components';
import { map } from 'rxjs/operators';
import {
  VBaseFormViewAction,
  VBaseFormViewActionModel,
  VBaseFormViewPresentType,
} from '../typings/v-base-form.typings';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { getTaskName } from '../tools/task.tools';
import { VBaseTabsPage } from './v-base-tabs.page';
import { XQueryDto, XQueryResultDto } from '../models/x-query.dto';

@Component({
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export abstract class VBaseDataPagerPage<T = any> extends VBaseTabsPage {
  //
  //#region Props ...
  //
  // XQueryDto ...
  filter: string;
  canSearch: boolean;
  isAscending = true;
  enableTracking = false;
  containsDetail = false;
  sortOrder: keyof Partial<T>;

  //
  readonly DataPagerPaginatorPositions = Object.assign(
    {},
    XDataPagerPaginatorPosition
  );
  readonly ModelPresentTypes = Object.assign({}, VBaseFormViewPresentType);
  readonly DataPagerPresentTypes = Object.assign({}, XDataPagerPresentType);

  //
  showDataPagerPaginator: boolean;
  dataPagerQuery: XBaseDataPagerQuery = {
    filter: '',
    pageNumber: 1,
    rowsInPage: this.config.defaultPageSize,
  };
  dataPagerResultListItems: XListItem<T>[];
  dataPagerResult: XBaseDataPagerQueryResult<T>;

  //
  listTabIndex: number;

  //
  selectedModel: T;
  canAddOrUpdate: boolean;
  hiddenModelKeys: XPartialModelFieldNames<T>;
  availableModelKeys: XPartialModelFieldNames<T>;
  sortOrderModelKeys: XPartialModelFieldNames<T>;
  hiddenLabelModelKeys: XPartialModelFieldNames<T>;
  modelActionProvider = new Subject<VBaseFormViewActionModel>();

  //
  //#region Default Slide Options ...
  //
  // Details ...
  readonly defaultDetailsSlideOption = {
    id: 'Details',
    icon: this.IconNames.visible,
    title: this.ResourceIDs.details,
    color: this.ColorNames.Secondary,
    onlyIcon: true,
    slot: 'start',
    disabled: this.isLoading || this.uiDisabled,
  } as XListItemSlideOption;

  //
  // Edit ...
  readonly defaultEditSlideOption = {
    id: 'Edit',
    icon: this.IconNames.edit,
    title: this.ResourceIDs.edit,
    color: this.ColorNames.Tertiary,
    onlyIcon: true,
    slot: 'start',
    disabled: this.isLoading || this.uiDisabled,
  } as XListItemSlideOption;

  //
  // Download ...
  readonly defaultDownloadSlideOption = {
    id: 'Download',
    icon: this.IconNames.download,
    color: this.ColorNames.Success,
    title: this.ResourceIDs.download,
    onlyIcon: true,
    slot: 'start',
    disabled: this.isLoading || this.uiDisabled,
  } as XListItemSlideOption;

  //
  // Remove ...
  readonly defaultRemoveSlideOption = {
    id: 'Remove',
    icon: this.IconNames.remove,
    title: this.ResourceIDs.delete,
    color: this.ColorNames.Danger,
    onlyIcon: true,
    slot: 'end',
    disabled: this.isLoading || this.uiDisabled,
  } as XListItemSlideOption;
  //#endregion
  //#endregion

  //
  //#region Abstract ...
  abstract modelKeyProvider: XModelKeyProvider<T>;

  abstract modelValueProvider: XModelValueProvider<T>;

  abstract getAddOrUpdateAvailableModelKeys(): XPartialModelFieldNames<T>;

  abstract provideSlideOptions(item: T): Promise<XListItemSlideOption[]>;

  abstract isSameAsDefault(item: T): boolean;

  abstract getTaskNames(): string[];

  abstract queryFetcherTask(query: XQueryDto): Observable<XQueryResultDto<T>>;

  abstract issueDataPagerTask(
    task: Observable<XBaseDataPagerQueryResult<T>>
  ): Promise<void>;

  abstract issueAddModelTask(model: T): Promise<void>;

  abstract issueUpdateModelTask(model: T): Promise<void>;

  abstract issueRemoveModelTask(model: T): Promise<void>;

  abstract handlePresentDetails(model: T): Promise<void>;

  abstract handlePresentAddForm(): Promise<void>;

  abstract handlePresentEditForm(model: T): Promise<void>;

  abstract modelFieldPreparer(model: T): T;
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycles ...
  //#endregion

  //
  //#region Register Handlers ...
  //#endregion

  //
  //#region Task Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  queryFetcher = (q: XBaseDataPagerQuery) => {
    //
    const apiQuery = this.toXQuery(q);
    return this.applyToDataPagerQueryResult(this.queryFetcherTask(apiQuery));
    // tslint:disable-next-line: semicolon
  };

  isSameAsSelectedModel(item: T) {
    return isSameObject(item as any, this.selectedModel as any);
  }
  //#endregion

  //
  //#region UI Handlers ...
  public async handleDataPagerTaskReady(
    task: Observable<XBaseDataPagerQueryResult<T>>
  ) {
    //
    // XBaseDataPagerQueryResult<any> ...
    if (!task || this.uiDisabled || this.isLoading) {
      return;
    }

    //
    await this.issueDataPagerTask(task);
  }

  public async handleDataPagerTaskFinished(
    result: XBaseDataPagerQueryResult<T>
  ) {
    //
    this.dataPagerResult = null;
    this.dataPagerResultListItems = null;
    this.detectChanges();

    //
    if (!result) {
      return;
    }

    //
    this.dataPagerResult = {
      ...result,
    };

    //
    this.canSearch =
      (this.hasChild(this.dataPagerResult.items) &&
        this.dataPagerResult.items.length > 1) ||
      !isNullOrEmptyString(this.dataPagerQuery.filter);

    //
    this.showDataPagerPaginator =
      this.hasChild(this.dataPagerResult.items) &&
      this.dataPagerResult.items.length > 1;

    //
    this.dataPagerResultListItems = await this.prepareListItems();
    await this.changeTab(this.listTabIndex);

    //
    this.detectChanges();
  }

  public async handleAddOrUpdateModelTaskFinished(model: T) {
    //
    if (!model) {
      return;
    }

    //
    this.lock = false;

    //
    this.handleResetDataPagerQuery();
  }

  public async handleAddOrUpdateFormModelChanged(model: T) {
    //
    if (!model || !this.selectedModel) {
      return;
    }

    //
    const isSameAsDefault = this.isSameAsDefault(model);
    const isSameAsSelectedModel = this.isSameAsSelectedModel(model);

    //
    this.lock = !isSameAsDefault && !isSameAsSelectedModel;
    this.canAddOrUpdate = !isSameAsSelectedModel;

    //
    this.detectChanges();
  }

  public async handleSubmitAddOrUpdateForm(model: T) {
    //
    if (!model || this.isLoading || this.uiDisabled || !this.canAddOrUpdate) {
      return;
    }

    //
    const isAdd = this.isSameAsDefault(this.selectedModel);
    if (isAdd) {
      await this.issueAddModelTask(model);
    } else {
      await this.issueUpdateModelTask(model);
    }
  }

  public async handleResetAddOrUpdateForm(model: T) {
    //
    if (!model) {
      return;
    }

    //
    await this.managerService.dialogService.presentAreYouSureYesNoDialog(() => {
      //
      this.lock = false;
      this.canAddOrUpdate = false;

      //
      this.modelActionProvider.next({
        action: VBaseFormViewAction.ResetForm,
      });
    });
  }

  public async handleCancelAddOrUpdateForm() {
    //
    if (this.canAddOrUpdate || this.isLocked) {
      //
      await this.managerService.dialogService.presentAreYouSureYesNoDialog(
        async () => {
          //
          this.lock = false;
          await this.toolbarBackHandler();
        }
      );

      //
      return;
    }

    //
    this.lock = false;
    await this.toolbarBackHandler();
  }
  //#endregion

  //
  //#region Actions ...
  async prepareListItems() {
    //
    if (!this.dataPagerResult || !this.hasChild(this.dataPagerResult.items)) {
      return [];
    }

    //
    const result = await Promise.all(
      this.dataPagerResult.items.map(async (i) => {
        //
        const slideOptions = await this.provideSlideOptions(
          this.modelFieldPreparer(i)
        );

        //
        return {
          data: i,
          slideOptions,
        } as XListItem<T>;
      })
    );

    //
    return result;
  }

  async handleResetDataPagerQuery() {
    //
    this.dataPagerQuery = {
      filter: '',
      pageNumber: 1,
      rowsInPage: this.config.defaultPageSize,
    };

    //
    this.selectedModel = null;
    await this.changeTab(this.listTabIndex);

    //
    this.detectChanges();
  }

  async handleSearchbarQuryChanged(query: string) {
    //
    this.dataPagerQuery = {
      ...this.dataPagerQuery,
      filter: query,
    };

    //
    this.detectChanges();
  }

  async handleDataPagerQueryChanged(query: XBaseDataPagerQuery) {
    //
    this.dataPagerQuery = {
      ...query,
    };
  }

  async handlePerformRemove(model: T) {
    //
    if (!model) {
      return;
    }

    //
    await this.managerService.dialogService.presentAreYouSureYesNoDialog(
      async () => {
        await this.issueRemoveModelTask(model);
      }
    );
  }

  isPageTask(key: string | any) {
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

  private applyToDataPagerQueryResult(result: Observable<XQueryResultDto<T>>) {
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
  //#endregion
}
