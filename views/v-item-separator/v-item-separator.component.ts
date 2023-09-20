import {
  XStandardType,
  XOneOrManyType,
  XColorIdentifier,
} from 'x-framework-core';
import { map } from 'rxjs/operators';
import { VBaseComponent } from '../classes/v-base.component';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'v-item-separator',
  templateUrl: './v-item-separator.component.html',
  styleUrls: ['./v-item-separator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VItemSeparatorComponent extends VBaseComponent {
  //
  //#region Props ...
  @Input()
  cssClass: XStandardType<XOneOrManyType<string>>;

  @Input()
  color: XStandardType<XColorIdentifier> = this.ColorNames.Dark;

  @Input()
  isForegroundColor: XStandardType<boolean> = true;
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
  getSeparator() {
    return this.getValue(this.managerService.currentLocale).pipe(
      map((locale) => {
        return locale === 'fa-IR' ? '، ' : locale === 'en-US' ? ' ,' : '';
      })
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
