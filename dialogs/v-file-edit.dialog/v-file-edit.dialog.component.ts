import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  XIconNames,
  XIDEComponent,
  XDialogComponent,
} from 'x-framework-components';
import {
  countChild,
  isNullOrUndefined,
  isNullOrEmptyString,
} from 'x-framework-core';
import { map } from 'rxjs/operators';
import {
  IDETabInitDescriptor,
  VFileEditDialogConfig,
  VFileEditEmptyContent,
  VFileEditDialogCssVars,
  defaultFileEditDialogConfig,
} from './v-file-edit.dialog.typings';

@Component({
  selector: 'v-file-edit.dialog.component',
  templateUrl: './v-file-edit.dialog.component.html',
  styleUrls: ['./v-file-edit.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VFileEditDialogComponent extends XDialogComponent {
  //
  //#region Props ...
  //
  isSameContent: boolean = false;

  //
  //#region Private/Readonly ...
  readonly IconNames = Object.assign({}, XIconNames);
  //#endregion

  //
  //#region View Childs ...
  @ViewChild('xIde')
  xIDEComponent: XIDEComponent;

  @ViewChild('vBaseDialogToolbar')
  dialogToolbar: ElementRef<any>;
  //#endregion
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycles ...
  afterViewInit() {
    super.afterViewInit();

    //
    this.applyToolbarHeight();
  }
  //#endregion

  //
  //#region Register Handlers ...
  //#endregion

  //
  //#region Task Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  getFileEditDialogConfig() {
    return this.getPayload().pipe(
      map((payload) =>
        isNullOrUndefined(payload)
          ? (defaultFileEditDialogConfig as VFileEditDialogConfig)
          : (payload as VFileEditDialogConfig)
      )
    );
  }

  actionProvider() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.actionProvider)
          ? config.actionProvider
          : defaultFileEditDialogConfig.actionProvider
      )
    );
  }

  defaultTabName() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.defaultTabName)
          ? config.defaultTabName
          : defaultFileEditDialogConfig.defaultTabName
      )
    );
  }

  theme() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.theme)
          ? config.theme
          : defaultFileEditDialogConfig.theme
      )
    );
  }

  minLines() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.minLines)
          ? config.minLines
          : defaultFileEditDialogConfig.minLines
      )
    );
  }

  maxLines() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.maxLines)
          ? config.maxLines
          : defaultFileEditDialogConfig.maxLines
      )
    );
  }

  fontSize() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.fontSize)
          ? config.fontSize
          : defaultFileEditDialogConfig.fontSize
      )
    );
  }

  readonly() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.readonly)
          ? config.readonly
          : defaultFileEditDialogConfig.readonly
      )
    );
  }

  highlightActiveLine() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.highlightActiveLine)
          ? config.highlightActiveLine
          : defaultFileEditDialogConfig.highlightActiveLine
      )
    );
  }

  wordWrapping() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.wordWrapping)
          ? config.wordWrapping
          : defaultFileEditDialogConfig.wordWrapping
      )
    );
  }

  showLineNumbers() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showLineNumbers)
          ? config.showLineNumbers
          : defaultFileEditDialogConfig.showLineNumbers
      )
    );
  }

  showPrintMargin() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showPrintMargin)
          ? config.showPrintMargin
          : defaultFileEditDialogConfig.showPrintMargin
      )
    );
  }

  showFoldWidgets() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showFoldWidgets)
          ? config.showFoldWidgets
          : defaultFileEditDialogConfig.showFoldWidgets
      )
    );
  }

  basicAutocompletion() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.basicAutocompletion)
          ? config.basicAutocompletion
          : defaultFileEditDialogConfig.basicAutocompletion
      )
    );
  }

  defaultActionBarItemColor() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.defaultActionBarItemColor)
          ? config.defaultActionBarItemColor
          : defaultFileEditDialogConfig.defaultActionBarItemColor
      )
    );
  }

  availableActionBarItems() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.availableActionBarItems)
          ? config.availableActionBarItems
          : defaultFileEditDialogConfig.availableActionBarItems
      )
    );
  }

  content() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.content)
          ? config.content
          : defaultFileEditDialogConfig.content
      )
    );
  }

  alignTabs() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.alignTabs)
          ? config.alignTabs
          : defaultFileEditDialogConfig.alignTabs
      )
    );
  }

  tabHeaderColor() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.tabHeaderColor)
          ? config.tabHeaderColor
          : defaultFileEditDialogConfig.tabHeaderColor
      )
    );
  }

  activeTabColor() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.activeTabColor)
          ? config.activeTabColor
          : defaultFileEditDialogConfig.activeTabColor
      )
    );
  }

  showActionBar() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showActionBar)
          ? config.showActionBar
          : defaultFileEditDialogConfig.showActionBar
      )
    );
  }

  actionBarColor() {
    return this.getFileEditDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.actionBarColor)
          ? config.actionBarColor
          : defaultFileEditDialogConfig.actionBarColor
      )
    );
  }
  //#endregion

  //
  //#region UI Handlers ...
  async handleCloseEditor() {
    //
    if (!this.isSameContent && !isNullOrEmptyString(this.selectedValue)) {
      //
      this.presentYesNoDialog(undefined, async () => {
        await this.handleClosePopup();
      });

      //
      return;
    }

    //
    await this.handleClosePopup();
  }

  async handleSaveEditor() {
    //
    if (this.isSameContent) {
      return;
    }

    //
    const hasSelectedValue = await this.getValueAsync(this.hasSelectedValue());
    if (isNullOrUndefined(this.xIDEComponent) || !hasSelectedValue) {
      return;
    }

    //
    this.presentYesNoDialog(undefined, async () => {
      //
      const isMultipleTabs = this.isMultipleTab();

      //
      //#region Multiple Tab ...
      if (isMultipleTabs) {
        //
        const tabs = Object.keys(this.selectedValue);
        if (!this.hasChild(tabs)) {
          return;
        }

        //
        // Prepare and check Empty tab Contents ...
        tabs.forEach((tn) => {
          //
          const isEmptyContent = isNullOrEmptyString(this.selectedValue[tn]);
          if (isEmptyContent) {
            this.selectedValue[tn] = VFileEditEmptyContent;
          }
        });

        //
        await this.handleSelect(this.selectedValue);

        //
        return;
      }
      //#endregion

      //
      //#region Single Tab ...
      //
      let currentContent = this.selectedValue as string;
      if (isNullOrEmptyString(currentContent)) {
        currentContent = VFileEditEmptyContent;
      }

      //
      await this.handleSelect(currentContent);
      //#endregion
    });
  }

  async handleIDEContentChanged(event: string) {
    //
    const isMultipleTab = this.isMultipleTab();

    //
    //#region Multiple Tab ...
    if (isMultipleTab) {
      //
      const ideTabs: IDETabInitDescriptor = {};
      this.xIDEComponent.Sessions.forEach((s) => {
        ideTabs[s.name] = s.session.getValue();
      });

      //
      this.selectedValue = ideTabs;

      //
      this.detectChanges();
      return;
    }
    //#endregion

    //
    //#region Single Tab ...
    //
    this.selectedValue = event;

    //
    const content = await this.getValueAsync(this.content());
    const currentContent = this.selectedValue as string;

    //
    this.isSameContent = content === currentContent;

    //
    this.detectChanges();
    //#endregion
  }
  //#endregion

  //
  //#region Actions ...
  //#endregion

  //
  //#region Abstracts ...
  //#endregion

  //
  //#region Private ...
  private applyToolbarHeight() {
    //
    if (
      isNullOrUndefined(this.dialogToolbar) ||
      isNullOrUndefined(this.dialogToolbar.nativeElement)
    ) {
      return;
    }

    //
    const element = this.dialogToolbar.nativeElement as HTMLElement;
    const toolbarHeight = element.clientHeight;

    //
    if (toolbarHeight === 0) {
      //
      setTimeout(() => {
        this.applyToolbarHeight();
      }, 500);

      //
      return;
    }

    //
    this.setCssVar(
      VFileEditDialogCssVars.DialogToolbarHeight,
      `${toolbarHeight}px`,
      this.element
    );

    //
    this.detectChanges();
  }

  private isMultipleTab() {
    //
    const result =
      !isNullOrUndefined(this.xIDEComponent) &&
      this.hasChild(this.xIDEComponent.Sessions) &&
      countChild(this.xIDEComponent.Sessions) > 1;

    //
    return result;
  }
  //#endregion
}
