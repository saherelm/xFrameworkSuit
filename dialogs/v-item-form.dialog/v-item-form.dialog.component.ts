import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  toArray,
  isNullOrUndefined,
  isNullOrEmptyString,
  XColorWithBrightness,
} from 'x-framework-core';
import {
  XFormStatus,
  XDialogComponent,
  XFormValueChangeEventModel,
  XFormStatusChangeEventModel,
} from 'x-framework-components';
import { map } from 'rxjs/operators';
import {
  VItemFormDialogConfig,
  VItemFormDialogCssVars,
  defaultItemFormDialogConfig,
} from './v-item-form.dialog.typings';

@Component({
  selector: 'v-item-form.dialog.component',
  templateUrl: './v-item-form.dialog.component.html',
  styleUrls: ['./v-item-form.dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VItemFormDialogComponent extends XDialogComponent {
  //
  //#region Props ...
  //
  //#region Private/Readonly Props ...
  readonly ColorNames = Object.assign({}, XColorWithBrightness);
  //#endregion

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
  getItemFormDialogConfig() {
    return this.getPayload().pipe(
      map((payload) =>
        !isNullOrUndefined(payload)
          ? (payload as VItemFormDialogConfig)
          : (defaultItemFormDialogConfig as VItemFormDialogConfig)
      )
    );
  }

  cssClass() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.cssClass)
          ? ['v-clear-box-shaddow-card', ...toArray(config.cssClass)]
          : [
              'v-clear-box-shaddow-card',
              ...toArray(defaultItemFormDialogConfig.cssClass),
            ]
      )
    );
  }

  hint() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.hint)
          ? config.hint
          : defaultItemFormDialogConfig.hint
      )
    );
  }

  title() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.title)
          ? config.title
          : defaultItemFormDialogConfig.title
      )
    );
  }

  defaultValue() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.defaultValue)
          ? config.defaultValue
          : defaultItemFormDialogConfig.defaultValue
      )
    );
  }

  tooltip() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrEmptyString(config.tooltip)
          ? config.tooltip
          : defaultItemFormDialogConfig.tooltip
      )
    );
  }

  hidden() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.hidden)
          ? config.hidden
          : defaultItemFormDialogConfig.hidden
      )
    );
  }

  placeholder() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.placeholder)
          ? config.placeholder
          : defaultItemFormDialogConfig.placeholder
      )
    );
  }

  isRequiredValue() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.isRequiredValue)
          ? config.isRequiredValue
          : defaultItemFormDialogConfig.isRequiredValue
      )
    );
  }

  prefixIcon() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.prefixIcon)
          ? config.prefixIcon
          : defaultItemFormDialogConfig.prefixIcon
      )
    );
  }

  suffixIcon() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.suffixIcon)
          ? config.suffixIcon
          : defaultItemFormDialogConfig.suffixIcon
      )
    );
  }

  eventHandlers() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.eventHandlers)
          ? config.eventHandlers
          : defaultItemFormDialogConfig.eventHandlers
      )
    );
  }

  errorHandlers() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.errorHandlers)
          ? config.errorHandlers
          : defaultItemFormDialogConfig.errorHandlers
      )
    );
  }

  showDefaultActions() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showDefaultActions)
          ? config.showDefaultActions
          : defaultItemFormDialogConfig.showDefaultActions
      )
    );
  }

  showOnlyIconActions() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showOnlyIconActions)
          ? config.showOnlyIconActions
          : defaultItemFormDialogConfig.showOnlyIconActions
      )
    );
  }

  showSubmitAction() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showSubmitAction)
          ? config.showSubmitAction
          : defaultItemFormDialogConfig.showSubmitAction
      )
    );
  }

  showClearAction() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showClearAction)
          ? config.showClearAction
          : defaultItemFormDialogConfig.showClearAction
      )
    );
  }

  showResetAction() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showResetAction)
          ? config.showResetAction
          : defaultItemFormDialogConfig.showResetAction
      )
    );
  }

  showPasteAction() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.showPasteAction)
          ? config.showPasteAction
          : defaultItemFormDialogConfig.showPasteAction
      )
    );
  }

  applyStatusOnControl() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.applyStatusOnControl)
          ? config.applyStatusOnControl
          : defaultItemFormDialogConfig.applyStatusOnControl
      )
    );
  }

  formActionProvider() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formActionProvider)
          ? config.formActionProvider
          : defaultItemFormDialogConfig.formActionProvider
      )
    );
  }

  formAppearance() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formAppearance)
          ? config.formAppearance
          : defaultItemFormDialogConfig.formAppearance
      )
    );
  }

  formHintColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formHintColor)
          ? config.formHintColor
          : defaultItemFormDialogConfig.formHintColor
      )
    );
  }

  formValidColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formValidColor)
          ? config.formValidColor
          : defaultItemFormDialogConfig.formValidColor
      )
    );
  }

  formAccentColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formAccentColor)
          ? config.formAccentColor
          : defaultItemFormDialogConfig.formAccentColor
      )
    );
  }

  formRegularColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formRegularColor)
          ? config.formRegularColor
          : defaultItemFormDialogConfig.formRegularColor
      )
    );
  }

  formActiveColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formActiveColor)
          ? config.formActiveColor
          : defaultItemFormDialogConfig.formActiveColor
      )
    );
  }

  formInvalidColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formInvalidColor)
          ? config.formInvalidColor
          : defaultItemFormDialogConfig.formInvalidColor
      )
    );
  }

  formPendingColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formPendingColor)
          ? config.formPendingColor
          : defaultItemFormDialogConfig.formPendingColor
      )
    );
  }

  formFillColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formFillColor)
          ? config.formFillColor
          : defaultItemFormDialogConfig.formFillColor
      )
    );
  }

  formDisabledColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formDisabledColor)
          ? config.formDisabledColor
          : defaultItemFormDialogConfig.formDisabledColor
      )
    );
  }

  formDisabledFillColor() {
    return this.getItemFormDialogConfig().pipe(
      map((config) =>
        !isNullOrUndefined(config.formDisabledFillColor)
          ? config.formDisabledFillColor
          : defaultItemFormDialogConfig.formDisabledFillColor
      )
    );
  }

  canSubmit() {
    return this.notEmptyValue(this.selectedValue);
  }
  //#endregion

  //
  //#region UI Handlers ...
  async handleSubmit(value: string) {
    //
    this.selectedValue = value;
    this.detectChanges();

    //
    this.getItemFormDialogConfig().subscribe((config) => {
      //
      if (isNullOrUndefined(config.submit)) {
        return;
      }

      //
      config.submit.emit(value);
    });

    //
    await this.handleClosePopup(this.selectedValue);
  }

  handleValueChanged(event: XFormValueChangeEventModel) {
    //
    if (isNullOrUndefined(event)) {
      return;
    }

    //
    this.selectedValue = event.value.value;
    this.detectChanges();

    //
    this.getItemFormDialogConfig().subscribe((config) => {
      //
      if (isNullOrUndefined(config.valueChanged)) {
        return;
      }

      //
      config.valueChanged.emit(event);
    });
  }

  handleStatusChanged(event: XFormStatusChangeEventModel) {
    //
    if (isNullOrUndefined(event)) {
      return;
    }

    //
    if (event.status !== XFormStatus.Valid) {
      //
      this.selectedValue = null;
      this.detectChanges();
    }

    //
    this.getItemFormDialogConfig().subscribe((config) => {
      //
      if (isNullOrUndefined(config.statusChanged)) {
        return;
      }

      //
      config.statusChanged.emit(event);
    });
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
      VItemFormDialogCssVars.DialogToolbarHeight,
      `${toolbarHeight}px`,
      this.element
    );

    //
    this.detectChanges();
  }
  //#endregion
}
