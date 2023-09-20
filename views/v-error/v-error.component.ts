import {
  isNullOrEmptyString,
  XColorIdentifier,
  XOneOrManyType,
  XResourceIdentifier,
  XStandardType,
} from 'x-framework-core';
import { VBaseInCardComponent } from '../classes/v-base.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'v-error',
  templateUrl: './v-error.component.html',
  styleUrls: ['./v-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VErrorComponent extends VBaseInCardComponent {
  //
  //#region Props ...
  //
  cardColor: XStandardType<string> = this.ColorNames.DangerShade;

  //
  @Input()
  cssClass: XOneOrManyType<string>;

  @Input()
  errorTitle: XResourceIdentifier = this.ResourceIDs.error;

  @Input()
  errorTitleColor: XColorIdentifier = this.ColorNames.Light;

  @Input()
  errors: XOneOrManyType<string>;

  @Input()
  color: XColorIdentifier = this.ColorNames.Warning;

  @Input()
  backgroundColor: XColorIdentifier = this.ColorNames.DangerShade;
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
  getColor() {
    return this.getValue(this.color).pipe(
      map((color) =>
        !isNullOrEmptyString(color) ? color : this.ColorNames.Warning
      )
    );
  }

  getErrorTitle() {
    return this.getResourceValue(
      isNullOrEmptyString(this.errorTitle.toString())
        ? this.errorTitle
        : this.ResourceIDs.error
    );
  }

  getErrorTitleColor() {
    return this.getValue(this.errorTitleColor).pipe(
      map((color) =>
        !isNullOrEmptyString(color) ? color : this.ColorNames.Light
      )
    );
  }

  getBackgroundColorValue() {
    return this.getValue(this.backgroundColor).pipe(
      map((color) =>
        !isNullOrEmptyString(color) ? color : this.ColorNames.DangerShade
      )
    );
  }

  getSingleErrorMessage() {
    return this.getArrayValue(this.errors).pipe(
      map((errors) => errors[0] || '')
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
  //#region Abstracts ...
  //#endregion

  //
  //#region Private ...
  //#endregion
}
