import {
  XOneOrManyType,
  XColorIdentifier,
  XColorWithBrightness,
} from 'x-framework-core';
import { Subject } from 'rxjs';
import {
  XFormActionModel,
  XFormErrorHandler,
  XFormIconDescriptor,
  XFormControlAppearance,
  XFormValueChangeEventModel,
  XFormStatusChangeEventModel,
  XFormControlEventsDescriptor,
} from 'x-framework-components';
import { EventEmitter } from '@angular/core';

//
export enum VItemFormDialogCssVars {
  DialogToolbarHeight = 'dialog-toolbar-height',
}

//
export interface VItemFormDialogConfig {
  cssClass?: XOneOrManyType<string>;
  hint?: string;
  title?: string;
  defaultValue?: string;
  tooltip?: string;
  hidden?: boolean;
  placeholder?: string;
  isRequiredValue?: boolean;
  prefixIcon?: XFormIconDescriptor;
  suffixIcon?: XFormIconDescriptor;
  eventHandlers?: XFormControlEventsDescriptor;
  errorHandlers?: XOneOrManyType<XFormErrorHandler>;
  showDefaultActions?: boolean;
  showOnlyIconActions?: boolean;
  showSubmitAction?: boolean;
  showClearAction?: boolean;
  showResetAction?: boolean;
  showPasteAction?: boolean;
  formCssClass?: XOneOrManyType<string>;
  applyStatusOnControl?: boolean;
  formActionProvider?: Subject<XFormActionModel>;
  formAppearance?: XFormControlAppearance;
  //
  formHintColor?: XColorIdentifier;
  formValidColor?: XColorIdentifier;
  formAccentColor?: XColorIdentifier;
  formRegularColor?: XColorIdentifier;
  formActiveColor?: XColorIdentifier;
  formInvalidColor?: XColorIdentifier;
  formPendingColor?: XColorIdentifier;
  formFillColor?: XColorIdentifier;
  formDisabledColor?: XColorIdentifier;
  formDisabledFillColor?: XColorIdentifier;
  //
  valueChanged?: EventEmitter<XFormValueChangeEventModel>;
  statusChanged?: EventEmitter<XFormStatusChangeEventModel>;
  submit?: EventEmitter<string>;
}

export const defaultItemFormDialogConfig: VItemFormDialogConfig = {
  //
  isRequiredValue: true,
  showDefaultActions: true,
  showOnlyIconActions: true,
  showSubmitAction: true,
  showClearAction: true,
  showResetAction: true,
  showPasteAction: true,
  applyStatusOnControl: true,
  formAppearance: XFormControlAppearance.Outline,
  //
  formHintColor: XColorWithBrightness.Tertiary,
  formValidColor: XColorWithBrightness.Success,
  formAccentColor: XColorWithBrightness.Secondary,
  formRegularColor: XColorWithBrightness.Dark,
  formActiveColor: XColorWithBrightness.Primary,
  formInvalidColor: XColorWithBrightness.Danger,
  formPendingColor: XColorWithBrightness.Warning,
  formFillColor: XColorWithBrightness.Primary,
  formDisabledColor: XColorWithBrightness.LightTint,
  formDisabledFillColor: XColorWithBrightness.LightShade,
};
