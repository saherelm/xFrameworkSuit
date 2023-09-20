import {
  nameof,
  toBoolean,
  XColorIdentifier,
  isNullOrUndefined,
  isNullOrEmptyString,
  XResourceIdentifier,
} from 'x-framework-core';
import { map } from 'rxjs/operators';
import { XIconIdentifier } from 'x-framework-components';
import { VBaseComponent } from '../classes/v-base.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'v-state',
  templateUrl: './v-state.component.html',
  styleUrls: ['./v-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VStateComponent extends VBaseComponent {
  //
  //#region Props ...
  @Input()
  state: boolean | string | any;

  @Input()
  showContent = true;

  @Input()
  showIcon = true;

  @Input()
  enabledStateResource: XResourceIdentifier = this.ResourceIDs.enable;

  @Input()
  enabledStateColor: XColorIdentifier = this.ColorNames.Success;

  @Input()
  enabledStateIconName: XIconIdentifier = this.IconNames.checked;

  @Input()
  disabledStateResource: XResourceIdentifier = this.ResourceIDs.disable;

  @Input()
  disabledStateColor: XColorIdentifier = this.ColorNames.Danger;

  @Input()
  disabledStateIconName: XIconIdentifier = this.IconNames.un_checked;
  //#endregion

  //
  //#region LifeCycles ...
  onChange(changeKeys: string[]) {
    super.onChange(changeKeys);

    //
    let detectChanges = false;

    //
    const isStateChanged = changeKeys.includes(
      nameof<VStateComponent>('state')
    );
    if (isStateChanged && isNullOrUndefined(this.state)) {
      //
      this.state = false;
      detectChanges = true;
    }

    //
    const isShowIconChanged = changeKeys.includes(
      nameof<VStateComponent>('showIcon')
    );
    if (isShowIconChanged && isNullOrUndefined(this.showIcon)) {
      //
      this.showIcon = true;
      detectChanges = true;
    }

    //
    const isShowContentChanged = changeKeys.includes(
      nameof<VStateComponent>('showContent')
    );
    if (isShowContentChanged && isNullOrUndefined(this.showContent)) {
      //
      this.showContent = true;
      detectChanges = true;
    }

    //
    const isEnabledStateColorChanged = changeKeys.includes(
      nameof<VStateComponent>('enabledStateColor')
    );
    if (
      isEnabledStateColorChanged &&
      isNullOrEmptyString(this.enabledStateColor as string)
    ) {
      //
      detectChanges = true;
      this.enabledStateColor = this.ColorNames.Success;
    }

    //
    const isEnabledStateIconNameChanged = changeKeys.includes(
      nameof<VStateComponent>('enabledStateIconName')
    );
    if (
      isEnabledStateIconNameChanged &&
      isNullOrEmptyString(this.enabledStateIconName as string)
    ) {
      //
      detectChanges = true;
      this.enabledStateIconName = this.IconNames.checked;
    }

    //
    const isEnabledStateResourceChanged = changeKeys.includes(
      nameof<VStateComponent>('enabledStateResource')
    );
    if (
      isEnabledStateResourceChanged &&
      isNullOrEmptyString(this.enabledStateResource as string)
    ) {
      //
      detectChanges = true;
      this.enabledStateResource = this.ResourceIDs.enable;
    }

    //
    const isDisabledStateColorChanged = changeKeys.includes(
      nameof<VStateComponent>('disabledStateColor')
    );
    if (
      isDisabledStateColorChanged &&
      isNullOrEmptyString(this.disabledStateColor as string)
    ) {
      //
      detectChanges = true;
      this.disabledStateColor = this.ColorNames.Danger;
    }

    //
    const isDisabledStateIconNameChanged = changeKeys.includes(
      nameof<VStateComponent>('disabledStateIconName')
    );
    if (
      isDisabledStateIconNameChanged &&
      isNullOrEmptyString(this.disabledStateIconName as string)
    ) {
      //
      detectChanges = true;
      this.disabledStateIconName = this.IconNames.un_checked;
    }

    //
    const isDisabledStateResourceChanged = changeKeys.includes(
      nameof<VStateComponent>('disabledStateResource')
    );
    if (
      isDisabledStateResourceChanged &&
      isNullOrEmptyString(this.disabledStateResource as string)
    ) {
      detectChanges = true;
      this.disabledStateResource = this.ResourceIDs.disable;
    }

    //
    // Detect Changed ...
    if (detectChanges) {
      this.detectChanges();
    }
  }
  //#endregion

  //
  //#region Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  isEnabled() {
    return this.getValue(this.state).pipe(map((state) => toBoolean(state)));
  }

  getColor() {
    return this.isEnabled().pipe(
      map((isEnabled) =>
        isEnabled ? this.enabledStateColor : this.disabledStateColor
      )
    );
  }

  getLabel() {
    return this.isEnabled().pipe(
      map((isEnabled) =>
        this.resourceProvider(
          isEnabled ? this.enabledStateResource : this.disabledStateResource
        )
      )
    );
  }

  getIconName() {
    return this.isEnabled().pipe(
      map((isEnabled) =>
        isEnabled ? this.enabledStateIconName : this.disabledStateIconName
      )
    );
  }
  //#endregion

  //
  //#region UI Handlers ...
  //#endregion

  //
  //#region Actions ...
  //#endregion

  //
  //#region Private ...
  //#endregion
}
