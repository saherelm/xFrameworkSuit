import {
  XStandardType,
  XOneOrManyType,
  XColorIdentifier,
  XResourceIdentifier,
  isNullOrEmptyString,
} from 'x-framework-core';
import { concatMap, map } from 'rxjs/operators';
import { VBaseComponent } from '../classes/v-base.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'v-item',
  templateUrl: './v-item.component.html',
  styleUrls: ['./v-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VItemComponent extends VBaseComponent {
  //
  //#region Props ...
  @Input()
  cssClass: XStandardType<XOneOrManyType<string>>;

  @Input()
  tooltip: XStandardType<string>;

  @Input()
  showTooltip: XStandardType<boolean> = true;

  @Input()
  applyMobileDisplay: XStandardType<boolean> = true;

  //
  @Input()
  showTitle: XStandardType<boolean> = true;

  @Input()
  titleCssClass: XStandardType<XOneOrManyType<string>>;

  @Input()
  title: XStandardType<XResourceIdentifier>;

  @Input()
  titleColor: XStandardType<XColorIdentifier> = this.ColorNames.Dark;

  @Input()
  isTitleForegroundColor: XStandardType<boolean> = true;

  //
  @Input()
  showValue: XStandardType<boolean> = true;

  @Input()
  valueCssClass: XStandardType<XOneOrManyType<string>>;

  @Input()
  value: XStandardType<string>;

  @Input()
  applyLocaleOnValue: XStandardType<boolean> = true;

  @Input()
  valueColor: XStandardType<XColorIdentifier> = this.ColorNames.Dark;

  @Input()
  isValueForegroundColor: XStandardType<boolean> = true;
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
  getTooltip() {
    return this.getValue(this.tooltip).pipe(
      concatMap((tooltip) =>
        this.getResourceValue(this.title).pipe(
          map((title) => {
            return {
              title,
              tooltip,
            };
          }),
          concatMap((data) =>
            this.getValue(this.value).pipe(
              map((value) => {
                return {
                  ...data,
                  value,
                };
              })
            )
          ),
          map((info) =>
            !isNullOrEmptyString(info.tooltip)
              ? info.tooltip
              : this.applyLocale(`${info.title} ${info.value}`)
          )
        )
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
  //#region Abstracts ...
  //#endregion

  //
  //#region Private ...
  //#endregion
}
