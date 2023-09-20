import { Subject } from 'rxjs';
import {
  XSlotName,
  XFabButton,
  XButtonType,
  XTabsAction,
  XSlotLayout,
  XFabButtonSize,
  XFabButtonSide,
  XTabsActionModel,
} from 'x-framework-components';
import { Component } from '@angular/core';
import { VPageComponent } from '../v-page/v-page.component';

@Component({
  template: '',
})
// tslint:disable-next-line: component-class-suffix
export abstract class VBaseTabsPage extends VPageComponent {
  //
  //#region Props ...
  //
  readonly SlotNames = Object.assign({}, XSlotName);
  readonly SlotLayouts = Object.assign({}, XSlotLayout);
  readonly ButtonTypes = Object.assign({}, XButtonType);

  //
  // Tabs Configs ...
  lastTab: number;
  selectedTab: number;
  tabsActionProvider = new Subject<XTabsActionModel>();

  //
  //#region Default Fab Buttons ...
  //
  // Edit ...
  readonly defaultEditFab: XFabButton = {
    id: 'Edit',
    index: 1,
    icon: this.IconNames.edit,
    tooltip: this.ResourceIDs.edit,
    size: XFabButtonSize.MINI,
    side: XFabButtonSide.TOP,
    disabled: this.isLoading || this.uiDisabled,
    color: this.ColorNames.Tertiary,
  };

  //
  // Remove ...
  readonly defaultRemoveFab: XFabButton = {
    id: 'Remove',
    index: 1,
    icon: this.IconNames.remove,
    tooltip: this.ResourceIDs.delete,
    size: XFabButtonSize.MINI,
    side: XFabButtonSide.TOP,
    disabled: this.isLoading || this.uiDisabled,
    color: this.ColorNames.Danger,
  };

  //
  // Add ...
  readonly defaultAddFab: XFabButton = {
    id: 'Add',
    index: 1,
    icon: this.IconNames.add,
    size: XFabButtonSize.REGULAR,
    color: this.ColorNames.Primary,
    tooltip: this.ResourceIDs.add,
    side: XFabButtonSide.TOP,
    disabled: this.isLoading || this.uiDisabled,
  };

  //
  // Upload ...
  readonly defaultUploadFab: XFabButton = {
    id: 'Upload',
    index: 1,
    icon: this.IconNames.upload,
    size: XFabButtonSize.REGULAR,
    color: this.ColorNames.Primary,
    tooltip: this.ResourceIDs.upload,
    side: XFabButtonSide.TOP,
    disabled: this.isLoading || this.uiDisabled,
  };

  //
  // Download ...
  readonly defaultDownloadFab: XFabButton = {
    id: 'Download',
    index: 1,
    icon: this.IconNames.download,
    size: XFabButtonSize.REGULAR,
    color: this.ColorNames.Success,
    tooltip: this.ResourceIDs.download,
    side: XFabButtonSide.TOP,
    disabled: this.isLoading || this.uiDisabled,
  };

  //
  // Select ...
  readonly defaultSelectFilesFab: XFabButton = {
    index: 1,
    id: 'SelectFiles',
    side: XFabButtonSide.TOP,
    icon: this.IconNames.touch,
    size: XFabButtonSize.REGULAR,
    color: this.ColorNames.Primary,
    tooltip: this.ResourceIDs.select,
    disabled: this.isLoading || this.uiDisabled,
  };

  //
  // More ...
  readonly defaultMoreFab: XFabButton = {
    id: 'More',
    index: 1,
    side: XFabButtonSide.TOP,
    size: XFabButtonSize.REGULAR,
    color: this.ColorNames.Primary,
    tooltip: this.ResourceIDs.options,
    icon: this.IconNames.menu_vertical,
    disabled: this.isLoading || this.uiDisabled,
  };
  //#endregion
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycles ...
  toolbarBackHandler = async () => {
    //
    if (this.isLoading || this.uiDisabled || this.isLocked) {
      return;
    }

    //
    await this.handleToolbarBackPressed();
  };
  //#endregion

  //
  //#region Register Handlers ...
  //#endregion

  //
  //#region Task Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  //#endregion

  //
  //#region UI Handlers ...
  //#endregion

  //
  //#region Actions ...
  async changeTab(tab: number) {
    //
    if (tab === this.selectedTab || this.isLocked) {
      return;
    }

    //
    this.selectedTab = tab;
    this.tabsActionProvider.next({
      action: XTabsAction.TO,
      payload: tab,
    });

    //
    await this.prepareStates();
  }
  //#endregion

  //
  //#region Abstracted ...
  abstract prepareStates(): Promise<void>;

  abstract handleToolbarBackPressed(): Promise<void>;
  //#endregion

  //
  //#region Private ...
  //#endregion
}
