import {
  Inject,
  NgZone,
  Renderer2,
  Component,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  XPopoverService,
  XComponentCardContainer,
  XComponentCardContainerComponent,
} from 'x-framework-components';
import { X_CONFIG } from '../../config/x.config';
import { XConfig } from '../../config/app.config';
import { ViewportRuler } from '@angular/cdk/overlay';
import { XManagerService } from 'x-framework-services';
import { XColorWithBrightness } from 'x-framework-core';
import { AppResourceIDs } from '../../config/localization.config';
import { XBaseComponent, XIconNames } from 'x-framework-components';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  template: '',
})
export abstract class VBaseComponent extends XBaseComponent {
  //
  //#region Props ...
  //
  readonly IconNames = Object.assign({}, XIconNames);
  readonly AppResourceIDs = Object.assign({}, AppResourceIDs);
  readonly ColorNames = Object.assign({}, XColorWithBrightness);

  //
  isMobileUi$ = this.managerService.isMobileUi$;
  isNotMobileUi$ = this.managerService.isNotMobileUi$;
  //#endregion

  //
  //#region Constructor ...
  public constructor(
    public zone: NgZone,
    @Inject(X_CONFIG)
    public config: XConfig,
    public element: ElementRef,
    public renderer: Renderer2,
    public ruler: ViewportRuler,
    public sharedService: SharedService,
    public managerService: XManagerService,
    public changeDetector: ChangeDetectorRef,
    protected popoverService: XPopoverService
  ) {
    super(
      config,
      managerService,
      element,
      renderer,
      ruler,
      zone,
      changeDetector
    );
  }
  //#endregion

  //
  //#region Protected ...
  //#endregion

  //
  //#region Private ...
  //#endregion
}

@Component({
  template: '',
})
export abstract class VBaseInCardComponent extends XComponentCardContainerComponent {
  //
  //#region Props ...
  //
  readonly IconNames = Object.assign({}, XIconNames);
  readonly AppResourceIDs = Object.assign({}, AppResourceIDs);
  readonly ColorNames = Object.assign({}, XColorWithBrightness);

  //
  isMobileUi$ = this.managerService.isMobileUi$;
  isNotMobileUi$ = this.managerService.isNotMobileUi$;
  //#endregion

  //
  //#region Constructor ...
  public constructor(
    public zone: NgZone,
    @Inject(X_CONFIG)
    public config: XConfig,
    public element: ElementRef,
    public renderer: Renderer2,
    public ruler: ViewportRuler,
    public sharedService: SharedService,
    public managerService: XManagerService,
    public changeDetector: ChangeDetectorRef,
    protected popoverService: XPopoverService,
    protected propertyProvider: XComponentCardContainer
  ) {
    super(
      config,
      managerService,
      element,
      renderer,
      ruler,
      zone,
      changeDetector,
      propertyProvider
    );
  }
  //#endregion

  //
  //#region Protected ...
  //#endregion

  //
  //#region Private ...
  //#endregion
}
