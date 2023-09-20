import { Pages } from 'src/app/config/page.config';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VPageComponent } from 'src/app/views/v-page/v-page.component';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.page.html',
  styleUrls: ['./not-authorized.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class NotAuthorizedPage extends VPageComponent {
  //
  //#region Page Props ...
  hasSide = false;
  toolbarHasBack = true;
  toolbarShowBack = true;
  showToolbarEndSlot = false;
  showToolbarContent = false;
  toolbarShowSubTitle = true;
  toolbarSubTitle = this.resourceProvider(this.titleRes);
  titleRes = this.AppResourceIDs.not_authorized_page_title;

  //
  toolbarBackHandler = () => {
    //
    // TODO: Fix this ...
    // this.managerService.navigateByPageReplace(Pages.);
  }
  //#endregion

  //
  //#region Constructor ...
  //#endregion
}
