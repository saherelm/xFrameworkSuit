import { Component, ChangeDetectionStrategy } from '@angular/core';
import { VPageComponent } from 'src/app/views/v-page/v-page.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line: component-class-suffix
export class LandingPage extends VPageComponent {
  //
  //#region Props ...
  hasSide = false;
  showFooter = false;
  titleRes = this.AppResourceIDs.landing_page_title;
  //#endregion

  //
  //#region LifeCycles ...
  //#endregion

  //
  //#region Handlers ...
  //#endregion

  //
  //#region UI Handlers ...
  handleIDEContentChanged(content: string) {
    console.log('handleIDEContentChanged: ', content);
  }
  //#endregion
}
