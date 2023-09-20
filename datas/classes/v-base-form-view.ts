import {
  nameof,
  toArray,
  isFunction,
  isSameObject,
  XStandardType,
  XOneOrManyType,
  XColorIdentifier,
  isNullOrUndefined,
  XModelKeyProvider,
  XModelValueProvider,
  isNullOrEmptyString,
  XColorWithBrightness,
  XModelFieldTypeIndex,
  XPartialModelFieldNames,
} from 'x-framework-core';
import {
  XFormConfig,
  XFormStatus,
  XFormActionModel,
  XFormStatusIdentifier,
  XFormControlAppearance,
  XFormValueChangeEventModel,
  XFormStatusChangeEventModel,
  XDescriptionListActionModel,
  XFormControlAppearanceIdentifier,
} from 'x-framework-components';
import {
  VBaseFormViewAction,
  VBaseFormViewActionModel,
  VBaseFormViewPresentType,
  VBaseFormViewPresentTypeIdentifier,
} from '../typings/v-base-form.typings';
import { Subject, Subscription } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { VBaseInCardComponent } from './v-base.component';
import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
  template: '',
})
export abstract class VBaseFormViewComponent<T> extends VBaseInCardComponent {
  //
  //#region Props ...
  isValid: boolean;
  validationError: string;
  hasValidationError = false;
  isSameAsDefaultModel: boolean;
  status: XFormStatusIdentifier;

  applyThemeColors = true;
  applyDefaultFormAppearance = true;

  //
  @Input()
  model: T;
  baseModel: T;
  defaultModel: T;

  //
  @Input()
  hideOptionalValues = false;

  @Input()
  availableModelKeys: XPartialModelFieldNames<T>;

  @Input()
  sortOrderModelKeys: XPartialModelFieldNames<T>;

  @Input()
  hiddenModelKeys: XPartialModelFieldNames<T>;

  @Input()
  hiddenLabelModelKeys: XPartialModelFieldNames<T>;

  @Input()
  modelKeyProvider: XModelKeyProvider<T>;

  @Input()
  modelValueProvider: XModelValueProvider<T>;

  //
  readonly PresentTypes = Object.assign({}, VBaseFormViewPresentType);

  //
  @Input()
  presentType: VBaseFormViewPresentTypeIdentifier =
    VBaseFormViewPresentType.AsForm;

  //
  formConfig: XFormConfig<T>;

  //
  //#region Form Props ...
  @Input()
  formAppearance: XStandardType<XFormControlAppearanceIdentifier> =
    XFormControlAppearance.Outline;

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
  //#region Description List Props ...
  @Input()
  cssClass: XOneOrManyType<string>;

  @Input()
  showLabels = true;

  @Input()
  color: XColorIdentifier = XColorWithBrightness.Light;

  @Input()
  foregroundColor = false;

  @Input()
  labelColor: XColorIdentifier = XColorWithBrightness.TertiaryShade;

  @Input()
  valueColor: XColorIdentifier = XColorWithBrightness.Dark;
  //#endregion

  //
  //#region ActionProvider ...
  private ACTION_PROVIDER_SUBSCRIPTION: Subscription;

  @Input()
  actionProvider: Subject<VBaseFormViewActionModel>;

  @Input()
  formActionProvider = new Subject<XFormActionModel>();

  @Input()
  descriptionListActionProvider = new Subject<XDescriptionListActionModel>();
  //#endregion

  //
  //#region Events ...
  @Output()
  modelAssigned = new EventEmitter<T>();

  @Output()
  modelChanged = new EventEmitter<T>();

  @Output()
  statusChanged = new EventEmitter<boolean>();
  //#endregion
  //#endregion

  //
  //#region Abstract ...
  abstract title: string;
  abstract FieldNames: XModelFieldTypeIndex<T>;
  abstract modelFieldPreparer: (model: T) => T;
  abstract prepareFormConfig(): Promise<void>;
  abstract defaultHiddenModelKeys(): XPartialModelFieldNames<T>;
  abstract defaultSortOrderModelKeys(): XPartialModelFieldNames<T>;
  abstract defaultHiddenLabelModelKeys(): XPartialModelFieldNames<T>;
  abstract defaultModelKeyProvider(): XModelKeyProvider<T>;
  abstract defaultModelValueProvider(): XModelValueProvider<T>;
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycles ...
  async onInit() {
    super.onInit();

    //
    await this.prepareModelProviders();

    //
    this.checkSameAsDefault();

    //
    if (!isNullOrUndefined(this.model)) {
      //
      this.baseModel = {
        ...this.model,
      };
      await this.configureForm();
    }
  }

  async onChange(changeKeys: string[]) {
    super.onChange(changeKeys);

    //
    //#region Model Changed ...
    const isModelChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('model')
    );
    const isDefaultModelChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('defaultModel')
    );

    //
    // Hnadle Model Changed ...
    if (isModelChanged) {
      //
      this.baseModel = {
        ...this.model,
      };
      await this.handleModelChaned();

      //
      this.modelAssigned.emit(this.model);
    }

    //
    // Handle Default Model Check ...
    if (isModelChanged || isDefaultModelChanged) {
      this.checkSameAsDefault();
    }
    //#endregion

    //
    //#region Action Providers ...
    const isActionProviderChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('actionProvider')
    );
    if (isActionProviderChanged) {
      this.registerActionProvider();
    }

    //
    const isFormActionProviderChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('formActionProvider')
    );
    if (isFormActionProviderChanged) {
      if (!this.formActionProvider) {
        this.formActionProvider = new Subject<XFormActionModel>();
      }
    }

    //
    const isDescriptionListActionProviderChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('descriptionListActionProvider')
    );
    if (isDescriptionListActionProviderChanged) {
      if (!this.descriptionListActionProvider) {
        this.descriptionListActionProvider =
          new Subject<XDescriptionListActionModel>();
      }
    }

    //
    if (isFormActionProviderChanged || isDescriptionListActionProviderChanged) {
      this.detectChanges();
    }
    //#endregion

    //
    //#region Color Changed ...
    const isColorChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('color')
    );
    if (isColorChanged) {
      //
      this.getValueAsync(this.color).then((color) => {
        this.color = !isNullOrEmptyString(color)
          ? color
          : XColorWithBrightness.Light;
      });
    }
    //#endregion

    //
    //#region ShowLabels Changed ...
    const isShowLabelsChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('showLabels')
    );
    if (isShowLabelsChanged) {
      if (isNullOrUndefined(this.showLabels)) {
        this.showLabels = true;
      }
    }
    //#endregion

    //
    //#region CardColor Changed ...
    const isCardColorChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('cardColor')
    );
    if (isCardColorChanged) {
      if (isNullOrUndefined(this.cardColor)) {
        this.cardColor = this.ColorNames.Light;
      }
    }
    //#endregion

    //
    //#region SortOrderModelKeys Changed ...
    const isSortOrderModelKeysChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('sortOrderModelKeys')
    );
    if (isSortOrderModelKeysChanged) {
      this.prepareSortOrderModelKeys();
    }
    //#endregion

    //
    //#region HiddenModelKeys Changed ...
    const isHiddenModelKeysChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('hiddenModelKeys')
    );
    if (isHiddenModelKeysChanged) {
      this.prepareHiddenModelKeys();
    }
    //#endregion

    //
    //#region HiddenLabelModelKeys Changed ...
    const isHiddenLabelModelKeysChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('hiddenLabelModelKeys')
    );
    if (isHiddenLabelModelKeysChanged) {
      this.prepareHiddenLabelModelKeys();
    }
    //#endregion

    //
    //#region ModelKeyProvider Changed ...
    const isModelKeyProviderChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('modelKeyProvider')
    );
    if (isModelKeyProviderChanged) {
      this.prepareModelKeyProvider();
    }
    //#endregion

    //
    //#region ModelValueProvider Changed ...
    const isModelValueProviderChanged = changeKeys.includes(
      nameof<VBaseFormViewComponent<T>>('modelValueProvider')
    );
    if (isModelValueProviderChanged) {
      this.prepareModelValueProvider();
    }
    //#endregion
  }

  onDestroy() {
    super.onDestroy();

    //
    this.unregisterActionProvider();
  }

  registerInstanceHandlers() {
    super.registerInstanceHandlers();

    //
    this.registerActionProvider();
  }
  //#endregion

  //
  //#region UI Handlers ...
  handleFormChange(event: XFormValueChangeEventModel) {
    //
    if (isNullOrUndefined(event) || isNullOrUndefined(event.value)) {
      return;
    }

    //
    const eventModel =
      this.modelFieldPreparer && isFunction(this.modelFieldPreparer)
        ? this.modelFieldPreparer(event.value)
        : (event.value as T);

    //
    this.model = {
      ...eventModel,
    };

    //
    this.checkSameAsDefault();
    this.detectChanges();

    //
    this.modelChanged.emit(this.model);
  }

  handleFormStatusChanged(event: XFormStatusChangeEventModel) {
    //
    if (isNullOrUndefined(event) || isNullOrEmptyString(event.status)) {
      return;
    }

    //
    this.status = event.status;
    this.isValid = this.status === XFormStatus.Valid;

    //
    this.detectChanges();
    this.statusChanged.emit(this.isValid);
  }
  //#endregion

  //
  //#region UI Providers ...
  public canShowKey(key: string) {
    return this.getArrayValue(this.availableModelKeys).pipe(
      concatMap((availableModelKeys) =>
        this.getArrayValue(this.hiddenModelKeys).pipe(
          map((hiddenModelKeys) => {
            return {
              availableModelKeys,
              hiddenModelKeys,
            };
          })
        )
      ),
      map((provider) => {
        //
        const hasChildHiddens = this.hasChild(provider.hiddenModelKeys);
        const hasChildAvailables = this.hasChild(provider.availableModelKeys);

        //
        if (!hasChildAvailables && !hasChildHiddens) {
          return true;
        }

        //
        const isInHiddens = provider.hiddenModelKeys.includes(key as any);
        const isInAvailables = provider.availableModelKeys.includes(key as any);

        //
        if (
          (!hasChildAvailables && !isInHiddens) ||
          (isInAvailables && !hasChildHiddens) ||
          (isInAvailables && !isInHiddens)
        ) {
          return true;
        }

        //
        return false;
      })
    );
  }

  public canShowLabelKey(key: string) {
    return this.getArrayValue(this.hiddenLabelModelKeys).pipe(
      map((hiddenLabelsModelKeys) => {
        //
        const hasChildHiddenLabels = this.hasChild(hiddenLabelsModelKeys);

        //
        if (!hasChildHiddenLabels) {
          return true;
        }

        //
        const isInHiddens = hiddenLabelsModelKeys.includes(key as any);
        return hasChildHiddenLabels && !isInHiddens;
      })
    );
  }
  //#endregion

  //
  //#region Actions ...
  public setValidationError(errorMsg: string) {
    //
    if (isNullOrEmptyString(errorMsg)) {
      return;
    }

    //
    this.hasValidationError = true;
    this.validationError = errorMsg;

    //
    this.detectChanges();
  }

  public clearValidationErrors() {
    //
    this.clearError();
    this.hasValidationError = false;
    this.validationError = null;

    //
    this.detectChanges();
  }

  public async clearForm() {
    //
    this.model = {
      ...this.defaultModel,
    };

    //
    this.checkSameAsDefault();
    await this.configureForm();

    //
    await this.onFormCleared();
    this.detectChanges();
  }

  public async resetForm() {
    //
    this.model = {
      ...this.baseModel,
    };

    //
    this.checkSameAsDefault();
    await this.configureForm();

    //
    await this.onFormResetted();
    this.detectChanges();
  }

  public async configureForm() {
    //
    const presentType = await this.getValueAsync(this.presentType);
    if (presentType !== VBaseFormViewPresentType.AsForm) {
      this.formConfig = null;
      return;
    }

    //
    await this.getValueAsync(this.prepareFormConfig());
    if (isNullOrUndefined(this.formConfig)) {
      return;
    }

    //
    if (this.applyDefaultFormAppearance) {
      //
      const controls = !isNullOrUndefined(this.formConfig.controls)
        ? await this.getArrayValueAsync(this.formConfig.controls)
        : [];

      //
      for (let i = 0; i < controls.length; i++) {
        //
        const control = controls[i];
        const appearance = await this.getValueAsync(control.appearance);

        //
        control.appearance = {
          ...appearance,
          appearance: this.formAppearance,
        };
      }

      //
      this.formConfig = {
        ...this.formConfig,
        controls: [...controls],
      };
    }

    //
    this.detectChanges();
  }
  //#endregion

  //
  //#region Protected Actions ...
  protected registerActionProvider() {
    //
    this.unregisterActionProvider();

    //
    if (!this.actionProvider) {
      this.actionProvider = new Subject<VBaseFormViewActionModel>();
    }

    //
    this.ACTION_PROVIDER_SUBSCRIPTION = this.actionProvider
      .asObservable()
      // tslint:disable-next-line: deprecation
      .subscribe(async (model) => {
        //
        if (!model) {
          return;
        }

        //
        switch (model.action) {
          //
          case VBaseFormViewAction.Refresh:
            this.detectChanges();
            break;

          //
          case VBaseFormViewAction.SetError:
            if (model.payload) {
              this.setValidationError(model.payload);
            }
            break;

          //
          case VBaseFormViewAction.ClearError:
            this.clearValidationErrors();
            break;

          //
          case VBaseFormViewAction.ClearForm:
            await this.clearForm();
            break;

          //
          case VBaseFormViewAction.ResetForm:
            await this.resetForm();
            break;
        }
      });
  }

  protected unregisterActionProvider() {
    //
    if (!this.ACTION_PROVIDER_SUBSCRIPTION) {
      return;
    }

    //
    this.ACTION_PROVIDER_SUBSCRIPTION.unsubscribe();
    this.ACTION_PROVIDER_SUBSCRIPTION = null;
  }

  protected async handleModelChaned() {
    await this.configureForm();
  }

  protected checkSameAsDefault() {
    //
    this.isSameAsDefaultModel = false;
    if (
      !isNullOrUndefined(this.model) &&
      !isNullOrUndefined(this.defaultModel)
    ) {
      this.isSameAsDefaultModel = isSameObject(
        this.modelFieldPreparer(this.model) as any,
        this.modelFieldPreparer(this.defaultModel) as any
      );
    }

    //
    this.detectChanges();
  }

  protected async onFormCleared(): Promise<void> {}

  protected async onFormResetted(): Promise<void> {}

  protected async onModelProvidersPrepared(): Promise<void> {}

  protected async onSortOrderModelKeysPrepared(): Promise<void> {}

  protected async onHiddenModelKeysPrepared(): Promise<void> {}

  protected async onHiddenLabelModelKeysPrepared(): Promise<void> {}

  protected async onModelKeyProviderPrepared(): Promise<void> {}

  protected async onModelValueProviderPrepared(): Promise<void> {}
  //#endregion

  //
  //#region Private ...
  private async prepareModelProviders() {
    //
    await this.prepareSortOrderModelKeys();
    await this.prepareHiddenModelKeys();
    await this.prepareHiddenLabelModelKeys();
    await this.prepareModelKeyProvider();
    await this.prepareModelValueProvider();

    //
    await this.onModelProvidersPrepared();
  }

  private async prepareSortOrderModelKeys() {
    //
    if (isNullOrUndefined(this.sortOrderModelKeys)) {
      //
      this.sortOrderModelKeys = [...toArray(this.defaultSortOrderModelKeys())];

      //
      await this.onSortOrderModelKeysPrepared();

      //
      this.detectChanges();
    } else {
      await this.onSortOrderModelKeysPrepared();
    }
  }

  private async prepareHiddenModelKeys() {
    //
    if (isNullOrUndefined(this.hiddenModelKeys)) {
      //
      this.hiddenModelKeys = [...toArray(this.defaultHiddenModelKeys())];

      //
      await this.onHiddenModelKeysPrepared();

      //
      this.detectChanges();
    } else {
      await this.onHiddenModelKeysPrepared();
    }
  }

  private async prepareHiddenLabelModelKeys() {
    //
    if (isNullOrUndefined(this.hiddenLabelModelKeys)) {
      //
      this.hiddenLabelModelKeys = this.defaultHiddenLabelModelKeys();

      //
      await this.onHiddenLabelModelKeysPrepared();

      //
      this.detectChanges();
    } else {
      await this.onHiddenLabelModelKeysPrepared();
    }
  }

  private async prepareModelKeyProvider() {
    //
    if (isNullOrUndefined(this.modelKeyProvider)) {
      //
      this.modelKeyProvider = this.defaultModelKeyProvider();

      //
      await this.onModelKeyProviderPrepared();

      //
      this.detectChanges();
    } else {
      await this.onModelKeyProviderPrepared();
    }
  }

  private async prepareModelValueProvider() {
    //
    if (isNullOrUndefined(this.modelValueProvider)) {
      //
      this.modelValueProvider = this.defaultModelValueProvider();

      //
      await this.onModelValueProviderPrepared();

      //
      this.detectChanges();
    } else {
      await this.onModelValueProviderPrepared();
    }
  }
  //#endregion
}
