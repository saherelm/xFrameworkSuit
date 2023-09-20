import { Pages } from 'src/app/config/page.config';
import { XButtonType } from 'x-framework-components';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VPageComponent } from 'src/app/views/v-page/v-page.component';
import { toArray, XOneOrManyType, XParam } from 'x-framework-core';

@Component({
  selector: 'app-error',
  templateUrl: './error.page.html',
  styleUrls: ['./error.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class ErrorPage extends VPageComponent {
  //
  //#region Props ...
  hasSide = false;
  toolbarHasBack = true;
  toolbarShowBack = true;
  showToolbarEndSlot = false;
  showToolbarContent = false;
  toolbarShowSubTitle = true;
  titleRes = this.AppResourceIDs.error_page_title;
  toolbarSubTitle = this.resourceProvider(this.titleRes);

  //
  errors: XOneOrManyType<string>;
  returnUrl = this.managerService.getPageRoute(Pages.Startup);

  //
  toolbarBackHandler = () => {
    this.managerService.navigateByUrlReplace(this.returnUrl);
  };

  //
  //#region Private/ReadOnly ...
  readonly ButtonTypes = Object.assign({}, XButtonType);
  //#endregion
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycle ...
  parseParams(): void {
    super.parseParams();

    //
    this.errors = [
      ...toArray(
        this.managerService.getStateValOfType<XOneOrManyType<string>>(
          XParam.Errors
        )
      ),
    ];

    //
    const isContainsReturnUrl = this.managerService.isContainState(
      XParam.ReturnUrl
    );
    if (isContainsReturnUrl) {
      this.returnUrl = this.managerService.getStateValOfType<string>(
        XParam.ReturnUrl
      );
    }

    //
    if (this.hasChild(this.errors)) {
      this.detectChanges();
    }
  }
  //#endregion

  //
  //#region Action Handlers ...
  //#endregion
}
