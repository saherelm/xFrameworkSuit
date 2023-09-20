import {
  Input,
  Inject,
  NgZone,
  Renderer2,
  Component,
  ViewChild,
  ElementRef,
  TemplateRef,
  EventEmitter,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  XColor,
  nameof,
  XLocale,
  notValue,
  XResourceIDs,
  XPickerColumn,
  XStandardType,
  XOneOrManyType,
  XColorIdentifier,
  XModalButtonRole,
  XPickerColumnOption,
  XColorWithBrightness,
} from 'x-framework-core';
import {
  XMenuSlot,
  XLogoSlot,
  XBackSlot,
  XSideType,
  XSideSlot,
  XTitleSlot,
  XIconNames,
  XMenuState,
  XContentSlot,
  XPageComponent,
  XPageContainer,
  XPopoverOption,
  XPopoverService,
  XNavigatorListItem,
  XBackSlotIdentifier,
  XLogoSlotIdentifier,
  XMenuSlotIdentifier,
  XPageSizeIdentifier,
  XSideSlotIdentifier,
  XSideTypeIdentifier,
  XTitleSlotIdentifier,
  XContentSlotIdentifier,
} from 'x-framework-components';
import { map } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';
import { X_CONFIG } from 'src/app/config/x.config';
import { Pages } from 'src/app/config/page.config';
import { XConfig } from 'src/app/config/app.config';
import { ViewportRuler } from '@angular/cdk/overlay';
import { XManagerService } from 'x-framework-services';
import { NavPageItems } from 'src/app/config/page.config';
import { isNullOrUndefined, hasChild } from 'x-framework-core';
import { AppResourceIDs } from 'src/app/config/localization.config';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'v-page',
  templateUrl: './v-page.component.html',
  styleUrls: ['./v-page.component.scss'],
  styles: [''],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VPageComponent extends XPageComponent {
  //
  //#region Props ...
  //
  applyThemeColors = true;

  //
  isMobileUi$ = this.managerService.isMobileUi$;
  isNotMobileUi$ = this.managerService.isNotMobileUi$;

  //
  readonly IconNames = Object.assign({}, XIconNames);
  readonly AppResourceIDs = Object.assign({}, AppResourceIDs);
  readonly ColorNames = Object.assign({}, XColorWithBrightness);

  //
  navPages = NavPageItems;

  //
  //#region CaptureMode ...
  enableCaptureMode: XStandardType<boolean> = false;
  downloadCapturedImage: XStandardType<boolean> = true;
  captureTopOffset: XStandardType<number> = 0;
  captureBottomOffset: XStandardType<number> = 0;
  imageCaptured = new EventEmitter<string | Blob>();
  //#endregion

  //
  //#region Page Props ...
  //
  //#region Toolbar Content ...
  @Input()
  showToolbarContent = true;
  private TOOLBAR_CONTENT_TEMPLATE: TemplateRef<any>;

  /**
   * the toolbar content ...
   */
  @ViewChild('toolbarContentTemplateRef', { static: false })
  set toolbarContentTemplateRef(v: TemplateRef<any>) {
    //
    if (isNullOrUndefined(v)) {
      return;
    }

    //
    this.TOOLBAR_CONTENT_TEMPLATE = v;
  }

  get toolbarContentTemplateRef() {
    return this.TOOLBAR_CONTENT_TEMPLATE;
  }
  //#endregion

  //
  //#region Toolbar End Slot ...
  @Input()
  showToolbarEndSlot = true;
  //#endregion

  //
  color: XStandardType<XColorIdentifier> = 'light-shade';
  cssClass: XStandardType<XOneOrManyType<string>>;
  //#endregion

  //
  //#region Toolbar Props ...
  //
  //#region Toolbar Boundary ...
  //
  showToolbar: XStandardType<boolean> = true;

  //
  toolbarColor: XStandardType<XColor> = XColor.Primary;
  //#endregion

  //
  //#region Toolbar ProgressBar ...
  toolbarProgressBarColor: XStandardType<XColor> = XColor.Warning;
  //#endregion

  //
  //#region Toolbar Title and SubTitle ...
  //
  // Toolbar Title ...
  toolbarTitleSlot: XStandardType<XTitleSlotIdentifier> = XTitleSlot.End;
  toolbarShowTitle: XStandardType<boolean> = true;
  toolbarShowSubTitle: XStandardType<boolean> = false;
  toolbarTitle: XStandardType<string> = super.resourceProvider(
    this.ResourceIDs.app_name
  );
  //#endregion

  //
  //#region Toolbar Logo ...
  toolbarLogoSlot: XStandardType<XLogoSlotIdentifier> = XLogoSlot.End;
  toolbarShowLogo: XStandardType<boolean> = true;
  toolbarLogoUrl: XStandardType<string> = './assets/image/logo.png';
  //#endregion

  //
  //#region Toolbar Back ...
  toolbarBackSlot: XStandardType<XBackSlotIdentifier> = XBackSlot.Start;
  toolbarShowBack: XStandardType<boolean> = false;
  toolbarHasBack: XStandardType<boolean> = true;
  toolbarDefaultHref: string = '';
  //#endregion

  //
  //#region Toolbar Menu ...
  toolbarMenuSlot: XStandardType<XMenuSlotIdentifier> = XMenuSlot.Start;

  //
  menuState: XStandardType<XMenuState> = XMenuState.WillClose;

  //
  toolbarShowMenu: XStandardType<boolean> = true;

  //
  toolbarHasMenu: XStandardType<boolean> = true;
  //#endregion

  //
  //#region Toolbar Templates ...
  toolbarContentSlot: XStandardType<XContentSlotIdentifier> =
    XContentSlot.Start;
  //#endregion
  //#endregion

  //
  //#region Scrolling Handlers ...
  provideScrollEvents: XStandardType<boolean> = true;
  scrollBehaviour: XOneOrManyType<string> = ['x-fab'];
  scrollStartClasses: XOneOrManyType<string> = 'start-scroll';
  scrollEndClasses: XOneOrManyType<string> = 'end-scroll';
  //#endregion

  //
  //#region Footer Props ...
  //
  footerColor: XStandardType<XColorIdentifier> = XColor.Primary;
  //#endregion

  //
  //#region Side Props ...
  //
  toggleMenuWhen: XStandardType<XPageSizeIdentifier> = 'md';
  hasSide: XStandardType<boolean> = true;
  sideSlot: XStandardType<XSideSlotIdentifier> = XSideSlot.Start;
  sideType: XStandardType<XSideTypeIdentifier> = XSideType.Overlay;
  sideColor: XStandardType<XColorIdentifier> = XColor.Primary;
  //#endregion
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
    public menuController: MenuController,
    public managerService: XManagerService,
    public changeDetector: ChangeDetectorRef,
    protected popoverService: XPopoverService,
    protected propertyProvider: XPageContainer
  ) {
    super(
      config,
      managerService,
      element,
      renderer,
      ruler,
      zone,
      changeDetector,
      menuController,
      propertyProvider
    );

    //
    this.isMobileUi$ = this.managerService.isMobileUi$;
    this.isNotMobileUi$ = notValue(this.isMobileUi$);
  }
  //#endregion

  //
  //#region LifeCycle ...
  onInit() {
    super.onInit();

    //
    this.menuState = this.isMobileUi$.pipe(
      map((isMobile) => (isMobile ? XMenuState.WillClose : XMenuState.Opened))
    );
  }

  async afterViewInit() {
    super.afterViewInit();

    //
    const showToolbar = await this.getValueAsync(this.showToolbar);
    if (showToolbar) {
      this.detectChanges();
    }

    //
    this.managerService.dispatchResizeEvent();
  }

  afterViewChecked() {
    super.afterViewChecked();

    //
    this.changeDetector.detectChanges();
  }

  async onChange(changeKeys: string[]) {
    super.onChange(changeKeys);

    //
    const isHasSideChanged = changeKeys.includes(
      nameof<VPageComponent>('hasSide')
    );
    if (isHasSideChanged) {
      await this.handleHasSideEffect();
    }

    //
    const isToolbarHasMenuChanged = changeKeys.includes(
      nameof<VPageComponent>('toolbarHasMenu')
    );
    const isToolbarShowMenuChanged = changeKeys.includes(
      nameof<VPageComponent>('toolbarShowMenu')
    );
    if (isToolbarHasMenuChanged || isToolbarShowMenuChanged) {
      this.detectChanges();
    }
  }
  //#endregion

  //
  //#region Register Handlers ...
  //#endregion

  //
  //#region Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  //#endregion

  //
  //#region UI Handlers ...
  async handleNavigatorItemSelected(event: XNavigatorListItem) {
    //
    if (!event) {
      return;
    }

    //
    // TODO: Complete Special Actions on NavItems ...
  }

  async handleMoreButtonClicked(event: Event) {
    //
    const onlyIcon = false;

    //
    const options: XPopoverOption[] = [];

    //
    // Refresh Page ...
    options.push({
      id: 'refresh_page',
      icon: XIconNames.refresh,
      title: XResourceIDs.refresh,
      color: XColor.Tertiary,
      slot: 'start',
      onlyIcon,
      handler: () => {
        this.managerService.settingsService.restart();
      }
    });

    //
    // Landing Page ...
    if (!isNullOrUndefined(this.config.defaultLandingPage)) {
      //
      // Landing ...
      options.push({
        id: 'go_landing',
        icon: XIconNames.refresh,
        title: AppResourceIDs.landing_page_title,
        color: XColor.Tertiary,
        slot: 'start',
        onlyIcon,
        handler: async () => {
          await this.managerService.navigateByPageReplace(Pages.Landing);
        },
      });
    }

    //
    // Change Language ...
    options.push({
      id: 'change_language',
      icon: XIconNames.language,
      title: XResourceIDs.language,
      color: XColor.Tertiary,
      slot: 'start',
      onlyIcon,
      handler: async () => {
        await this.handleChangeLocale();
      },
    });

    //
    // Capture Mode ...
    const isCaptureModeEnabled = await this.getValueAsync(
      this.enableCaptureMode
    );
    const isNotMobileUi = await this.getValueAsync(this.isNotMobileUi$);
    if (isNotMobileUi) {
      if (isCaptureModeEnabled) {
        //
        options.push({
          id: 'disable_capture_mode',
          icon: XIconNames.crop,
          title: XResourceIDs.disable_capture_mode,
          color: XColor.Danger,
          slot: 'start',
          onlyIcon,
          handler: async () => {
            //
            this.enableCaptureMode = false;
            this.detectChanges();
          },
        });
      } else {
        //
        options.push({
          id: 'enable_capture_mode',
          icon: XIconNames.crop,
          title: XResourceIDs.enable_capture_mode,
          color: XColor.Tertiary,
          slot: 'start',
          onlyIcon,
          handler: async () => {
            //
            this.enableCaptureMode = true;
            this.detectChanges();
          },
        });
      }
    }

    //
    // Theme ...
    options.push({
      id: 'theme_manager',
      icon: XIconNames.color_palette,
      title: AppResourceIDs.theme_manager,
      color: XColor.Tertiary,
      slot: 'start',
      onlyIcon,
      handler: async () => {
        //
        const route = this.managerService.mergeRoutes(Pages.ThemeManager.route);
        await this.managerService.navigateByUrlReplace(route);
      },
    });

    //
    await this.popoverService.presentContextMenu(options, event);
  }

  async handleImageCaptured(image: string | Blob) {
    //
    if (image) {
      this.imageCaptured.emit(image);
    }

    //
    this.enableCaptureMode = false;
    this.detectChanges();
  }
  //#endregion

  //
  //#region Provided Actions ...
  //#endregion

  //
  //#region Private ...
  private async handleHasSideEffect() {
    //
    const hasSide = await this.getValueAsync(this.hasSide);
    if (!hasSide) {
      //
      this.toolbarHasMenu = false;
      this.toolbarShowMenu = false;
      this.toggleMenuWhen = '';
    }
  }

  private async handleChangeLocale() {
    //
    const currentLocale = this.managerService.currentLocale;
    const availableLanguages = this.config.availableLanguages.map((ai) => {
      return {
        name: ai.name,
        locale: ai.locale,
      };
    });
    if (!hasChild(availableLanguages)) {
      return;
    }

    //
    const localOptions: XPickerColumnOption[] = availableLanguages.map((al) => {
      //
      const op: XPickerColumnOption = {
        text: al.name,
        value: al.locale,
        disabled: al.locale === currentLocale,
      };

      //
      return op;
    });
    const localColumn: XPickerColumn = {
      name: 'locales',
      options: localOptions,
    };

    //
    await this.managerService.dialogService.presentPicker({
      buttons: [
        {
          text: XResourceIDs.ok,
          role: XModalButtonRole.Selected,
          cssClass: ['btn-selected'],
          handler: async (value) => {
            //
            const selectedLocale: XLocale = value?.locales?.value;
            if (!selectedLocale) {
              return;
            }

            //
            await this.managerService.settingsService.changeLocale(
              selectedLocale,
              true
            );
          },
        },
        {
          text: XResourceIDs.cancel,
          role: XModalButtonRole.Cancel,
          cssClass: ['btn-cancel'],
          handler: () => {},
        },
      ],
      columns: [localColumn],
    });
  }
  //#endregion
}
