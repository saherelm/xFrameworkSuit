import {
  XPage,
  isNullOrUndefined,
} from 'x-framework-core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VPageComponent } from 'src/app/views/v-page/v-page.component';
import { Pages } from 'src/app/config/page.config';

const StartupKeys = {
  AuthLoadingID: 'auth_loading',
};

@Component({
  selector: 'app-startup',
  templateUrl: './startup.page.html',
  styleUrls: ['./startup.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class StartupPage extends VPageComponent {
  //
  //#region Configuration Props ...
  //
  hasSide = false;
  showToolbarEndSlot = false;
  showToolbarContent = false;

  //
  hasBlogPage = !isNullOrUndefined(this.config.defaultBlogPage);
  hasLandingPage = !isNullOrUndefined(this.config.defaultLandingPage);

  //
  private loadingModal: HTMLIonLoadingElement;
  //#endregion

  //
  //#region Constructor ...
  //#endregion

  //
  //#region LifeCycle ...
  async onInit() {
    super.onInit();

    //
    await this.handleStartUp();
  }
  //#endregion

  //
  //#region Private ...
  private async handleStartUp() {
    //
    // TODO: Handle Authentication if required ...

    //
    await this.presentLoading(
      StartupKeys.AuthLoadingID,
      this.resourceProvider(this.AppResourceIDs.default_loading)
    );

    //
    if (!this.hasBlogPage && !this.hasLandingPage) {
      //
      // TODO: do anything if need ...
    }

    //
    // TODO: Fix this ...
    this.finishAction();
    // this.finishAction(Pages.);
    return;
  }

  private async finishAction(dest?: XPage) {
    //
    await this.dismissLoading(StartupKeys.AuthLoadingID);

    //
    if (this.hasBlogPage && !this.hasLandingPage) {
      //
      await this.managerService.navigateByPageReplace(
        this.config.defaultBlogPage
      );
      return;
    }

    //
    if (this.hasLandingPage) {
      //
      await this.managerService.navigateByPageReplace(
        this.config.defaultLandingPage
      );
      return;
    }

    //
    if (!isNullOrUndefined(dest)) {
      await this.managerService.navigateByPageReplace(dest);
    }
  }

  private async presentLoading(id: string, message: string) {
    //
    if (!isNullOrUndefined(this.loadingModal) && this.loadingModal) {
      await this.dismissLoading(StartupKeys.AuthLoadingID);
    }

    //
    this.loadingModal = await this.managerService.dialogService.presentLoading({
      id,
      message,
    });
  }

  private async dismissLoading(id: string) {
    //
    if (isNullOrUndefined(this.loadingModal)) {
      return false;
    }

    //
    const result =
      await this.managerService.dialogService.loadingController.dismiss(id);
    if (!!result) {
      this.loadingModal = undefined;
    }

    //
    return result;
  }
  //#endregion
}
