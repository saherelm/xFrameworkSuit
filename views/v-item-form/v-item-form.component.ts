import {
  Input,
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  nameof,
  generateUuid,
  XStandardType,
  XOneOrManyType,
  XColorIdentifier,
  isNullOrUndefined,
  isNullOrEmptyString,
  XColorWithBrightness,
} from 'x-framework-core';
import {
  XSlotName,
  XFormConfig,
  XFormStatus,
  XSlotLayout,
  XButtonType,
  XFormActionModel,
  XFormControlType,
  XFormErrorHandler,
  XFormControlConfig,
  XFormIconDescriptor,
  XFormStatusIdentifier,
  XFormControlAppearance,
  XFormValueChangeEventModel,
  XFormStatusChangeEventModel,
  XFormControlEventsDescriptor,
  XFormControlAppearanceIdentifier,
} from 'x-framework-components';
import { Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { ItemFormModel } from './v-item-form.typings';
import { VBaseInCardComponent } from '../classes/v-base.component';

@Component({
  selector: 'v-item-form',
  templateUrl: './v-item-form.component.html',
  styleUrls: ['./v-item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VItemFormComponent extends VBaseInCardComponent {
  //
  //#region Props ...
  @Input()
  cssClass: XStandardType<XOneOrManyType<string>>;

  @Input()
  hint: XStandardType<string>;

  @Input()
  title: XStandardType<string>;

  @Input()
  defaultValue: XStandardType<string>;

  @Input()
  tooltip: XStandardType<string>;

  @Input()
  hidden: XStandardType<boolean>;

  @Input()
  placeholder: XStandardType<string>;

  @Input()
  isRequiredValue: XStandardType<boolean> = true;

  @Input()
  prefixIcon: XStandardType<XFormIconDescriptor>;

  @Input()
  suffixIcon: XStandardType<XFormIconDescriptor>;

  @Input()
  eventHandlers: XFormControlEventsDescriptor;

  @Input()
  errorHandlers: XStandardType<XOneOrManyType<XFormErrorHandler>>;

  //
  //#region Actions Props ...
  @Input()
  showDefaultActions: XStandardType<boolean> = true;

  @Input()
  showOnlyIconActions: XStandardType<boolean> = true;

  @Input()
  showSubmitAction: XStandardType<boolean> = true;

  @Input()
  showClearAction: XStandardType<boolean> = true;

  @Input()
  showResetAction: XStandardType<boolean> = true;

  @Input()
  showPasteAction: XStandardType<boolean> = true;
  //#endregion

  //
  //#region Form Props ...
  @Input()
  applyStatusOnControl: XStandardType<boolean> = true;

  @Input()
  formActionProvider = new Subject<XFormActionModel>();

  @Input()
  formAppearance: XStandardType<XFormControlAppearanceIdentifier> =
    XFormControlAppearance.Outline;

  @Input()
  formHintColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Tertiary;

  @Input()
  formValidColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Success;

  @Input()
  formAccentColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Secondary;

  @Input()
  formRegularColor: XStandardType<XColorIdentifier> = XColorWithBrightness.Dark;

  @Input()
  formActiveColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Primary;

  @Input()
  formInvalidColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Danger;

  @Input()
  formPendingColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.Warning;

  @Input()
  formFillColor: XStandardType<XColorIdentifier> = XColorWithBrightness.Primary;

  @Input()
  formDisabledColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.LightTint;

  @Input()
  formDisabledFillColor: XStandardType<XColorIdentifier> =
    XColorWithBrightness.LightShade;
  //#endregion

  //
  @Output()
  valueChanged = new EventEmitter<XFormValueChangeEventModel>();

  @Output()
  statusChanged = new EventEmitter<XFormStatusChangeEventModel>();

  @Output()
  submited = new EventEmitter<string>();

  //
  focusHandler = new Subject();

  //
  currentValue: string;
  model: ItemFormModel = {
    value: '',
  };
  isValid: boolean = false;
  isSameAsDefault: boolean = true;
  isEmptyCurrentValue: boolean = true;
  currentStatus: XFormStatusIdentifier;
  formConfig: XFormConfig<ItemFormModel>;

  //
  readonly SlotNames = Object.assign({}, XSlotName);
  readonly ButtonTypes = Object.assign({}, XButtonType);
  readonly SlotLayouts = Object.assign({}, XSlotLayout);
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycles ...
  async onInit() {
    super.onInit();

    //
    await this.configureForm();
  }

  async onChange(changeKeys: string[]) {
    super.onChange(changeKeys);

    //
    const isHintChanged = changeKeys.includes(
      nameof<VItemFormComponent>('hint')
    );
    const isTitleChanged = changeKeys.includes(
      nameof<VItemFormComponent>('title')
    );
    const isHiddenChanged = changeKeys.includes(
      nameof<VItemFormComponent>('hidden')
    );
    const isTooltipChanged = changeKeys.includes(
      nameof<VItemFormComponent>('tooltip')
    );
    const isPrefixIconChanged = changeKeys.includes(
      nameof<VItemFormComponent>('prefixIcon')
    );
    const isSuffixIconChanged = changeKeys.includes(
      nameof<VItemFormComponent>('suffixIcon')
    );
    const isPlaceholderChanged = changeKeys.includes(
      nameof<VItemFormComponent>('placeholder')
    );
    const isDefaultValueChanged = changeKeys.includes(
      nameof<VItemFormComponent>('defaultValue')
    );
    const isRequiredValueChanged = changeKeys.includes(
      nameof<VItemFormComponent>('isRequiredValue')
    );
    const isEventHandlerssChanged = changeKeys.includes(
      nameof<VItemFormComponent>('eventHandlers')
    );
    const isErrorHandlerssChanged = changeKeys.includes(
      nameof<VItemFormComponent>('errorHandlers')
    );
    const isApplyStatusOnControlChanged = changeKeys.includes(
      nameof<VItemFormComponent>('applyStatusOnControl')
    );

    //
    //#region reconfig form ...
    if (
      isHintChanged ||
      isTitleChanged ||
      isHiddenChanged ||
      isTooltipChanged ||
      isPrefixIconChanged ||
      isSuffixIconChanged ||
      isPlaceholderChanged ||
      isDefaultValueChanged ||
      isRequiredValueChanged ||
      isEventHandlerssChanged ||
      isErrorHandlerssChanged ||
      isApplyStatusOnControlChanged
    ) {
      await this.configureForm();
    }
    //#endregion
  }

  afterViewInit(): void {
      super.afterViewInit();

      //
      setTimeout(() => {
        this.focusHandler.next(undefined);
      }, 500);
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
  //#endregion

  //
  //#region UI Handlers ...
  async handleItemFormValueChanged(model: XFormValueChangeEventModel) {
    //
    if (isNullOrUndefined(model) || isNullOrUndefined(model.value)) {
      return;
    }

    //
    this.currentValue = model.value.value;

    //
    let defaultValue = await this.getValueAsync(this.defaultValue);
    if (isNullOrEmptyString(defaultValue)) {
      defaultValue = '';
    }

    //
    this.isEmptyCurrentValue = isNullOrEmptyString(this.currentValue);
    this.isSameAsDefault = this.currentValue === defaultValue;

    //
    this.valueChanged.emit(model);

    //
    this.detectChanges();
  }

  handleItemFormStatusChanged(model: XFormStatusChangeEventModel) {
    //
    if (isNullOrUndefined(model) || isNullOrEmptyString(model.status)) {
      return;
    }

    //
    this.currentStatus = model.status;
    this.isValid = model.status === XFormStatus.Valid;

    //
    this.statusChanged.emit(model);

    //
    this.detectChanges();
  }

  handleItemFormSubmit() {
    //
    if (!this.isValid) {
      return;
    }

    //
    this.submited.emit(this.currentValue);
  }

  async handleItemFormReset() {
    //
    if (this.isSameAsDefault) {
      return;
    }

    //
    await this.managerService.dialogService.presentAreYouSureYesNoDialog(
      async () => {
        await this.configureForm();
      }
    );
  }

  async handleItemFormClear() {
    //
    if (this.isEmptyCurrentValue) {
      return;
    }

    //
    await this.managerService.dialogService.presentAreYouSureYesNoDialog(
      async () => {
        await this.configureForm(true);
      }
    );
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
  private async configureForm(forceClear = false) {
    //
    const formName = generateUuid('ItemValueForm');

    //
    let formValue = forceClear
      ? ''
      : await this.getValueAsync(this.defaultValue);
    let formModel: ItemFormModel = {
      ...this.model,
    };
    if (!isNullOrEmptyString(formValue)) {
      formModel = {
        ...formModel,
        value: formValue,
      };
    }

    //
    this.formConfig = {
      name: formName,
      model: {
        ...formModel,
      },
      controls: [],
    };

    //
    const hint = await this.getValueAsync(this.hint);
    const label = await this.getValueAsync(this.title);
    const hidden = await this.getValueAsync(this.hidden);
    const applyStatusOnControl = await this.getValueAsync(
      this.applyStatusOnControl
    );
    const tooltip = await this.getValueAsync(this.tooltip);
    let prefixIcon = await this.getValueAsync(this.prefixIcon);
    let suffixIcon = await this.getValueAsync(this.suffixIcon);
    const placeholder = await this.getValueAsync(this.placeholder);
    const appearance = await this.getValueAsync(this.formAppearance);
    const isRequired = await this.getValueAsync(this.isRequiredValue);
    const errorHandlers = await this.getValueAsync(this.errorHandlers);

    //
    //#region Configure Controls ...
    //
    const controls: XOneOrManyType<XFormControlConfig<ItemFormModel>> = [];

    //
    //#region value ...
    let valueControl: any = {
      index: 0,
      propName: 'value',
      focusHandler: this.focusHandler,
      type: {
        type: XFormControlType.Text,
      },
      appearance: {
        appearance,
        label,
      },
    };

    //
    // Hidden ...
    if (!!hidden) {
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          hidden,
        },
      };
    }

    //
    // Hint ...
    if (!isNullOrEmptyString(hint)) {
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          hint,
        },
      };
    }

    //
    // Validators ...
    if (isRequired) {
      valueControl = {
        ...valueControl,
        validators: {
          validators: [Validators.required],
        },
      };
    }

    //
    // Tooltip ...
    if (!isNullOrEmptyString(tooltip)) {
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          tooltip,
        },
      };
    }

    //
    // PlaceHolder ...
    if (!isNullOrEmptyString(placeholder)) {
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          placeholder,
        },
      };
    }

    //
    // Prefix Icon ...
    if (!isNullOrUndefined(prefixIcon)) {
      //
      if (!!applyStatusOnControl) {
        prefixIcon = {
          ...prefixIcon,
          applyStateColor: applyStatusOnControl,
        };
      }

      //
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          icons: {
            prefix: {
              ...prefixIcon,
            },
          },
        },
      };
    }

    //
    // Suffix Icon ...
    if (!isNullOrUndefined(suffixIcon)) {
      //
      if (!!applyStatusOnControl) {
        suffixIcon = {
          ...suffixIcon,
          applyStateColor: applyStatusOnControl,
        };
      }

      //
      valueControl = {
        ...valueControl,
        appearance: {
          ...valueControl.appearance,
          icons: {
            suffix: {
              ...suffixIcon,
            },
          },
        },
      };
    }

    //
    // EventHandlerss ...
    if (!isNullOrUndefined(this.eventHandlers)) {
      valueControl = {
        ...valueControl,
        eventHandlers: {
          ...this.eventHandlers,
        },
      };
    }

    //
    // ErrorHandlerss ...
    if (!isNullOrUndefined(errorHandlers)) {
      valueControl = {
        ...valueControl,
        errorHandlers,
      };
    }

    //
    const vControl = valueControl as XFormControlConfig<ItemFormModel>;
    controls.push(vControl);
    //#endregion

    //
    this.formConfig = {
      ...this.formConfig,
      controls: [...controls],
    };
    //#endregion

    //
    this.detectChanges();
  }
  //#endregion
}
