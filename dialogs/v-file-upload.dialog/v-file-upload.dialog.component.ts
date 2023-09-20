import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { map } from 'rxjs/operators';
import {
  VFileUploadDialogConfig,
  VFileUploadDialogCssVars,
  defaultFileUploadDialogConfig,
} from './v-file-upload.dialog.typings';
import { XDialogComponent } from 'x-framework-components';
import { isNullOrUndefined, toArray, XOneOrManyType } from 'x-framework-core';

@Component({
  selector: 'v-file-upload.dialog.component',
  templateUrl: './v-file-upload.dialog.component.html',
  styleUrls: ['./v-file-upload.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VFileUploadDialogComponent extends XDialogComponent {
  //
  //#region Props ...
  //
  //#region View Childs ...
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
  getFileUploadDialogConfig() {
    return this.getPayload().pipe(
      map((payload) =>
        !isNullOrUndefined(payload)
          ? (payload as VFileUploadDialogConfig)
          : (defaultFileUploadDialogConfig as VFileUploadDialogConfig)
      )
    );
  }

  maxAllowedFiles() {
    return this.getFileUploadDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.maxAllowedFiles)
          ? config.maxAllowedFiles
          : defaultFileUploadDialogConfig.maxAllowedFiles
      )
    );
  }

  showFileDropArea() {
    return this.getFileUploadDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showFileDropArea)
          ? config.showFileDropArea
          : defaultFileUploadDialogConfig.showFileDropArea
      )
    );
  }

  hideActionBarItems() {
    return this.getFileUploadDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.hideActions)
          ? toArray(config.hideActions)
          : defaultFileUploadDialogConfig.hideActions
      )
    );
  }

  allowedExtensions() {
    return this.getFileUploadDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.allowedExtensions)
          ? toArray(config.allowedExtensions)
          : defaultFileUploadDialogConfig.allowedExtensions
      )
    );
  }

  minAllowedFileSize() {
    return this.getFileUploadDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.minAllowedFileSize)
          ? config.minAllowedFileSize
          : defaultFileUploadDialogConfig.minAllowedFileSize
      )
    );
  }
  //#endregion

  //
  //#region UI Handlers ...
  handleFileUploadFileChanged(files: XOneOrManyType<File>) {
    this.selectedValue = [...toArray(files)];
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
      VFileUploadDialogCssVars.DialogToolbarHeight,
      `${toolbarHeight}px`,
      this.element
    );

    //
    this.detectChanges();
  }
  //#endregion
}
