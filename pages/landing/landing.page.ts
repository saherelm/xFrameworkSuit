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
  registerViewHandlers(): void {
    super.registerViewHandlers();

    //
    if (this.sharedService.electronService.isElectron()) {
      // //
      // this.sharedService.projectManagementService
      //   .getPackResourceFiles()
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });

      // //
      // const path = `C:\\Users\\SaherElm\\Documents\\xFrameworkAppCreator`;
      // this.sharedService.fileManipulationService
      //   .removeDirectory(path, true)
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });

      // //
      // this.sharedService.projectManagementService
      //   .getProjectsContents()
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });

      // //
      // this.sharedService.fileManipulationService
      //   .getWorkspacePath()
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });

      // //
      // this.sharedService.fileManipulationService
      //   .getProjectsPath()
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });

      //
      // const path = '/Users/saherelm/Documents/xFrameworkAppCreator/Projects';
      // this.sharedService.fileManipulationService
      //   .isDirectoryExists(path)
      //   .pipe(
      //     concatMap((isExists) => {
      //       //
      //       if (!!isExists) {
      //         return this.sharedService.fileManipulationService.getDirectoryContents(
      //           path
      //         );
      //       } else {
      //         return this.getArrayValue([]);
      //       }
      //     })
      //   )
      //   .subscribe((result) => {
      //     console.log('Contents: ', result);
      //   });
    }
  }
  //#endregion

  //
  //#region UI Handlers ...
  handleIDEContentChanged(content: string) {
    console.log('handleIDEContentChanged: ', content);
  }
  //#endregion
}
