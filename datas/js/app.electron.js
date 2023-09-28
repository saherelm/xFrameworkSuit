//
//#region Required Modules ...
const url = require("url");
const path = require("path");
const { Subject } = require("rxjs");
const XUuidTools = require("./modules/tools/x-uuid.tools");
const XFileTools = require('./modules/tools/x-file.tools');
const XLoggerTools = require("./modules/tools/x-logger.tools");
const XWindowTools = require('./modules/tools/x-window.tools');
// const XProjectTools = require('./modules/services/x-project.service');
const { app, shell, Tray, ipcMain, BrowserWindow, Menu } = require("electron");
const { XElectronChannel, XElectronMessage } = require('./modules/services/x-electron.service');
//#endregion

//
//#region Prepare Required Config Data ...
//
// Set Environment ...
process.env.NODE_ENV = 'production';

//
const isDevelopment = process.env.NODE_ENV !== "production" ? true : false; // app.isPackaged;
const isMac = process.platform === "darwin" ? true : false;

//
// Show Logs ...
const showLogs = true;

//
// Show Debug Window ...
const showDebug = true;

//
// Force Window to show fullscreen ...
const isFullscreen = false;

//
// Show Window on Startup ...
const showWindowOnStartup = true;

//
const iconPath = path.join(__dirname, "www/assets/icon/favicon.png");
const trayIconPath = path.join(__dirname, "www/assets/icon/icon-16x16.png");
//#endregion

//
//#region Handle Logging ...
if (showLogs) {
  //
  XLoggerTools.changeBaseLogTag("xFrameworkSuite");
  XLoggerTools.enableLogging();
} else {
  XLoggerTools.disableLogging();
}
//#endregion

//
//#region Global Objects ...
//
let tray;
let mainUrl;
let mainWindow;
let mainWindowID;

//
const appId = XUuidTools.generateUuid('xFrameworkSuite');
//#endregion

//
//#region Subscribers ...
//
const otherChannelsSubject = new Subject();
const defaultChannelSubject = new Subject();
const handShakeChannelSubject = new Subject();

//
// Register Handshake Handler ...
handShakeChannelSubject
  .asObservable()
  .subscribe(message => {
    //
    XLoggerTools.logWarn(
      XLoggerTools.XLogMessage(
        XLoggerTools.XLogTag.Warn,
        `Handshake Channel`,
        [message]
      )
    );
  });

//
// Register Default Handler ...
defaultChannelSubject
  .asObservable()
  .subscribe(message => {
    //
    XLoggerTools.logWarn(
      XLoggerTools.XLogMessage(
        XLoggerTools.XLogTag.Warn,
        `Default Channel`,
        [message]
      )
    );
  });

//
// Register Other Handler ...
otherChannelsSubject
  .asObservable()
  .subscribe(async message => {
    //
    XLoggerTools.logWarn(
      XLoggerTools.XLogMessage(
        XLoggerTools.XLogTag.Warn,
        `Other Channel`,
        [message]
      )
    );

    //
    // File Service ...
    if (message && message.channel === XElectronChannel.FileService) {
      await handleFileServiceAction(message);
    }

    //
    // Projects Service ...
    if (message && message.channel === XElectronChannel.ProjectsService) {
      await handleProjectsServiceAction(message);
    }
  });
//#endregion

//
//#region Creator Fuctions ...
/**
 * Creat SysTray Object for using in app ...
 */
function createTray() {
  //
  // Create Tray Instance ...
  tray = new Tray(trayIconPath);
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'Tray Created ...'));

  //
  // Attach Event Listener to Tray Click ...
  tray.on("click", () => {
    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'Tray Clicked ...'));

    //
    toggleMainWindow();
  });

  //
  // Attach Event Listener to Tray RightClick ...
  tray.on("right-click", () => {
    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'Tray Right Clicked ...'));

    //
    const contextMenu = Menu.buildFromTemplate([
      {
        label: "quit",
        click: () => {
          //
          app.isClosing = true;
          app.quit();
        },
      },
    ]);

    //
    tray.popUpContextMenu(contextMenu);
  });
}

/**
 * Create Main Window Instance ...
 */
function createWindow() {
  //
  // Create Main Window ...
  mainWindow = new BrowserWindow({
    icon: iconPath,
    show: showWindowOnStartup,
    width: isDevelopment ? 1200 : 800,
    height: isDevelopment ? 800 : 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  //
  // Handle FullScreen state if Window shown on startup ...
  if (isFullscreen && showWindowOnStartup) {
    mainWindow.maximize();
    mainWindow.setFullScreen(true);
  }

  //
  // Generate Main Windows UUID ...
  mainWindowID = XUuidTools.generateUuid("xFrameworkSuite");
  mainWindow.name = mainWindowID;
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `Window ${mainWindowID} Created ...`));

  //
  // Fix new Window Open action ...
  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();

    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'New Window Requested ...'));

    //
    shell.openExternal(url);
  });

  //
  // Handle load Main Url on Navigate for handling Navigation on Angular Apps ...
  mainWindow.webContents.on("will-navigate", function (e, url) {
    e.preventDefault();

    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'Window Will Navigate Called ...'));

    //
    mainWindow.loadURL(mainUrl);
  });

  //
  // Prepare Main Url ...
  mainUrl = url.format({
    pathname: path.join(__dirname, "/www/index.html"),
    protocol: "file",
    slashes: true,
  });

  //
  var mainFile = path.join(__dirname, "/www/index.html");

  //
  // Load Content on Main Window ...
  // mainWindow.loadURL(mainUrl);
  mainWindow.loadFile(mainFile);

  //
  // Remove Browser Window Default menu ...
  mainWindow.removeMenu();

  //
  // Open Dev Tools on Development environment ...
  if (showDebug) {
    //
    mainWindow.webContents.openDevTools();
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, 'Window Dev Tools Opened ...'));
  }

  //
  // Handle Window Closed ...
  mainWindow.on("closed", () => {
    //
    mainWindow = null;
    XWindowTools.remove(mainWindowID);

    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `Window ${mainWindowID} Closed ...`));
  });

  //
  // Handle Window Close ...
  mainWindow.on("close", (e) => {
    //
    if (!app.isClosing) {
      //
      e.preventDefault();

      //
      mainWindow.hide();

      //
      XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `Window ${mainWindowID} Hided ...`));
    }

    //
    return true;
  });

  //
  // Send Handshake Message to Angular App for Notifing id of main window ...
  mainWindow.webContents.on("did-finish-load", () => {
    //
    // Instancing new Message for Sending ...
    const handshakeMsg = new XElectronMessage(
      appId,
      mainWindowID,
      undefined,
      undefined,
      XElectronChannel.Handshake,
      new Date().getTime()
    );

    //
    // Sending Handshake Message to MainWindow ...
    sendMessage(handshakeMsg);

    //
    XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `sending Handshake to Window ${mainWindowID} ...`));
  });

  //
  //#region IPC Handlers ...
  //
  // Register Event Handler for HandShake ...
  ipcMain.on(XElectronChannel.Handshake, (event, message) => {
    //
    if (!message || !message.sender) {
      return;
    }

    //
    const windowID = message.sender;
    XWindowTools.set(windowID, mainWindow);

    //
    handShakeChannelSubject.next(message);
  });

  //
  // Register Event Handler for Message ...
  ipcMain.on(XElectronChannel.Default, (event, message) => {
    defaultChannelSubject.next(message);
  });

  //
  const channels = Object.assign({}, XElectronChannel);
  delete channels.Default;
  delete channels.Handshake;

  //
  Object.keys(channels).forEach(channel => {
    //
    // Register Event Handler for Message on other Channel ...
    ipcMain.on(channels[channel], (event, message) => {
      otherChannelsSubject.next(message);
    });
  });
  //#endregion
}

/**
 * Toggle Show/Hide Main Window ...
 */
function toggleMainWindow() {
  //
  if (!mainWindow) {
    return;
  }

  //
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `Toggle Window ...`));

  //
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    //
    if (isFullscreen) {
      mainWindow.maximize();
      mainWindow.setFullScreen(true);
    }
    mainWindow.show();
  }
}
//#endregion

//
//#region Event Emitters ...
/**
 * attach event to call when it's ready, to app object ...
 */
app.whenReady().then(() => {
  //
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `App Ready ...`));

  //
  createTray();
  createWindow();
});

/**
 * attach event to call when all application Windows closed, to app object ...
 */
app.on("window-all-closed", () => {
  //
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `All Windows Closed ...`));

  //
  if (!isMac) {
    app.quit();
  }
});

/**
 * attach event to call when application activated, to app object ...
 */
app.on("activate", () => {
  //
  XLoggerTools.logDebug(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Debug, `App Activated ...`));

  //
  if (!mainWindow) {
    createWindow();
  }
});
//#endregion

//
//#region Window Comminucations ...
/**
 * send a message to specified window ...
 * 
 * @param {XElectronMessageDto} message the message which required to send ...
 */
function sendMessage(message) {
  //
  if (!message) {
    return;
  }

  //
  if (!message.sender) {
    message.sender = appId;
  }

  //
  if (!message.reciever) {
    message.reciever = mainWindowID;
  }

  //
  let destWindow = undefined;
  if (XWindowTools.count() === 0) {
    destWindow = mainWindow;
  } else {
    destWindow = XWindowTools.get(message.reciever);
  }

  //
  if (!destWindow) {
    //
    const errorMessage = 'Dest Window not found ...';
    XLoggerTools.logError(XLoggerTools.XLogMessage(XLoggerTools.XLogTag.Error, errorMessage))
    throw errorMessage;
  }

  //
  // Sending Message to Window ...
  destWindow.webContents.send(
    message.channel,
    JSON.stringify(message)
  );
}
//#endregion

//
//#region FileService Actions ...
async function handleFileServiceAction(message) {
  //
  if (!message || !message.sender) {
    return;
  }

  //
  XLoggerTools.log(
    XLoggerTools.XLogMessage(
      XLoggerTools.XLogTag.Debug,
      `calling XFile action: ${message.message}, by providing args: ${message.payload ? JSON.stringify(message.payload) : ''} ...`
    )
  );

  //
  let result;
  switch (message.message) {
    //
    //#region Global ...
    case XFile.ActionNames.getStatus:
      result = XFile.getStatus(message.payload);
      break;

    case XFile.ActionNames.getDocumentsPath:
      result = XFile.getDocumentsPath();
      break;

    case XFile.ActionNames.getDocumentsContents:
      result = await XFile.getDocumentsContents();
      break;
    //#endregion

    //
    //#region Path ...
    case XFile.ActionNames.basename:
      result = XFile.basename(message.payload);
      break;
    //#endregion

    //
    //#region File ...
    case XFile.ActionNames.currentFile:
      result = XFile.currentFile();
      break;

    case XFile.ActionNames.isFileExists:
      result = XFile.isFileExists(message.payload);
      break;

    case XFile.ActionNames.removeFile:
      result = await XFile.removeFile(message.payload);
      break;

    case XFile.ActionNames.copyFile:
      result = await XFile.copyFile(message.payload.source, message.payload.dest);
      break;

    case XFile.ActionNames.readFile:
      result = await XFile.readFile(message.payload);
      break;

    case XFile.ActionNames.writeFile:
      result = await XFile.writeFile(
        message.payload.path,
        message.payload.content,
        message.payload.overwrite
      );
      break;

    case XFile.ActionNames.createFile:
      result = await XFile.createFile(
        message.payload.path,
        message.payload.fileName,
      );
      break;

    case XFile.ActionNames.removeFileExtension:
      result = XFile.removeFileExtension(message.payload);
      break;
    //#endregion

    //
    //#region Directory ...
    case XFile.ActionNames.currentDir:
      result = XFile.currentDir();
      break;

    case XFile.ActionNames.copyFolder:
      //
      console.log('copyFolder call: ', message.payload);

      //
      result = await XFile.copyFolder(
        message.payload.source,
        message.payload.dest,
        message.payload.overwrite
      );
      break;

    case XFile.ActionNames.createDirectory:
      result = XFile.createDirectory(
        message.payload.path,
        message.payload.recursive
      );
      break;

    case XFile.ActionNames.removeDirectory:
      result = await XFile.removeDirectory(
        message.payload.path,
        message.payload.recursive
      );
      break;

    case XFile.ActionNames.getDirectoryContents:
      result = await XFile.getDirectoryContents(message.payload);
      break;

    case XFile.ActionNames.getDirectoryFiles:
      result = await XFile.getDirectoryFiles(message.payload);
      break;

    case XFile.ActionNames.getDirectoryFolders:
      result = await XFile.getDirectoryFolders(message.payload);
      break;

    case XFile.ActionNames.isDirectoryExists:
      result = XFile.isDirectoryExists(message.payload);
      break;
    //#endregion
  }

  //
  handleFileServiceActionResponse(message.sender, message.message, result);
}

function handleFileServiceActionResponse(reciever, actionName, response) {
  //
  if (!reciever || !actionName) {
    return;
  }

  //
  XLoggerTools.log(
    XLoggerTools.XLogMessage(
      XLoggerTools.XLogTag.Debug,
      `sending XFile action: ${actionName}, result: ${response} ...`
    )
  );

  //
  sendMessage(
    new XElectronMessage(
      appId,
      reciever,
      actionName,
      response,
      XElectronChannel.FileService
    )
  );
}
//#endregion 

//
//#region ProjectsService Actions ...
async function handleProjectsServiceAction(message) {
  //
  if (!message || !message.sender) {
    return;
  }

  //
  XLoggerTools.log(
    XLoggerTools.XLogMessage(
      XLoggerTools.XLogTag.Debug,
      `calling XProjects action: ${message.message}, by providing args: ${message.payload ? JSON.stringify(message.payload) : ''} ...`
    )
  );

  //
  let result;
  switch (message.message) {
    //
    //#region Paths ... 
    //
    case XProject.ActionNames.getAssetsPath:
      result = XProject.getAssetsPath();
      break;

    //
    case XProject.ActionNames.getResourcesPath:
      result = XProject.getResourcesPath();
      break;

    //
    case XProject.ActionNames.getProjectsPath:
      result = XProject.getProjectsPath();
      break;

    //
    case XProject.ActionNames.getWorkspacePath:
      result = XProject.getWorkspacePath();
      break;

    //
    case XProject.ActionNames.getPackResourcePath:
      result = XProject.getPackResourcePath();
      break;

    //
    case XProject.ActionNames.getDataResourcePath:
      result = XProject.getDataResourcePath();
      break;

    //
    case XProject.ActionNames.getPagesResourcePath:
      result = XProject.getPagesResourcePath();
      break;

    //
    case XProject.ActionNames.getViewsResourcePath:
      result = XProject.getViewsResourcePath();
      break;
    //#endregion

    //
    //#region Contents ...
    //
    case XProject.ActionNames.getProjectsContents:
      result = await XProject.getProjectsContents();
      break;

    //
    case XProject.ActionNames.getResourcesContents:
      result = await XProject.getResourcesContents();
      break;

    //
    case XProject.ActionNames.getResourcesContentsOnWorkspace:
      result = await XProject.getResourcesContentsOnWorkspace();
      break;

    //
    case XProject.ActionNames.getWorkspaceContents:
      result = await XProject.getWorkspaceContents();
      break;

    //
    //#region Pack ...
    //
    //#region Local ...
    case XProject.ActionNames.getPackResourceFiles:
      result = await XProject.getPackResourceFiles();
      break;

    //
    case XProject.ActionNames.getPackResourceContents:
      result = await XProject.getPackResourceContents();
      break;

    //
    case XProject.ActionNames.removePackResourceFile:
      result = await XProject.removePackResourceFile(message.payload);
      break;
    //#endregion

    //
    //#region OnWorkspace ...
    case XProject.ActionNames.getPackResourceFilesOnWorkspace:
      result = await XProject.getPackResourceFilesOnWorkspace();
      break;

    //
    case XProject.ActionNames.getPackResourceContentsOnWorkspace:
      result = await XProject.getPackResourceContentsOnWorkspace();
      break;

    //
    case XProject.ActionNames.removePackResourceFileOnWorkspace:
      result = await XProject.removePackResourceFileOnWorkspace(message.payload);
      break;
    //#endregion
    //#endregion

    //
    //#region Data ...
    //
    case XProject.ActionNames.getDefaultDataResourceFiles:
      result = XProject.getDefaultDataResourceFiles();
      break;

    //
    //#region Local ...
    //
    case XProject.ActionNames.getDataResourceContents:
      result = await XProject.getDataResourceContents();
      break;

    //
    case XProject.ActionNames.getDataResourceFiles:
      result = await XProject.getDataResourceFiles();
      break;

    //
    case XProject.ActionNames.removeDataResourceFile:
      result = await XProject.removeDataResourceFile(message.payload);
      break;

    //
    case XProject.ActionNames.readDataResourceFileContent:
      result = await XProject.readDataResourceFileContent(message.payload);
      break;

    //
    case XProject.ActionNames.writeDataResourceFileContent:
      result = await XProject.writeDataResourceFileContent(
        message.payload.name,
        message.payload.content,
        message.payload.overwrite
      );
      break;
    //#endregion

    //
    //#region OnWorkspace ...
    //
    case XProject.ActionNames.getDataResourceContentsOnWorkspace:
      result = await XProject.getDataResourceContentsOnWorkspace();
      break;

    //
    case XProject.ActionNames.getDataResourceFilesOnWorkspace:
      result = await XProject.getDataResourceFilesOnWorkspace();
      break;

    //
    case XProject.ActionNames.removeDataResourceFileOnWorkspace:
      result = await XProject.removeDataResourceFileOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.readDataResourceFileContentOnWorkspace:
      result = await XProject.readDataResourceFileContentOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.writeDataResourceFileContentOnWorkspace:
      result = await XProject.writeDataResourceFileContentOnWorkspace(
        message.payload.name,
        message.payload.content,
        message.payload.overwrite
      );
      break;
    //#endregion    
    //#endregion

    //
    //#region Pages ...
    //
    case XProject.ActionNames.getDefaultPagesResources:
      result = XProject.getDefaultPagesResources();
      break;

    //
    //#region Local ...
    //
    case XProject.ActionNames.getPagesResourceContents:
      result = await XProject.getPagesResourceContents();
      break;

    //
    case XProject.ActionNames.getPagesResources:
      result = await XProject.getPagesResources();
      break;

    //
    case XProject.ActionNames.removePageResource:
      result = await XProject.removePageResource(message.payload);
      break;

    //
    case XProject.ActionNames.createPage:
      result = await XProject.createPage(message.payload.pageName, message.payload.componentName);
      break;

    //
    case XProject.ActionNames.getPageContent:
      result = await XProject.getPageContent(message.payload);
      break;

    //
    case XProject.ActionNames.getPageContentPath:
      result = await XProject.getPageContentPath(message.payload);
      break;
    //#endregion

    //
    //#region OnWorkspace ...
    //
    case XProject.ActionNames.getPagesResourceContentsOnWorkspace:
      result = await XProject.getPagesResourceContentsOnWorkspace();
      break;

    //
    case XProject.ActionNames.getPagesResourcesOnWorkspace:
      result = await XProject.getPagesResourcesOnWorkspace();
      break;

    //
    case XProject.ActionNames.removePageResourceOnWorkspace:
      result = await XProject.removePageResourceOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.createPageOnWorkspace:
      result = await XProject.createPageOnWorkspace(
        message.payload.pageName,
        message.payload.componentName
      );
      break;

    //
    case XProject.ActionNames.getPageContentOnWorkspace:
      result = await XProject.getPageContentOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.getPageContentPathOnWorkspace:
      result = await XProject.getPageContentPathOnWorkspace(message.payload);
      break;
    //#endregion
    //#endregion

    //
    //#region Views ...
    //
    case XProject.ActionNames.getDefaultViewsResources:
      result = XProject.getDefaultViewsResources();
      break;

    //
    //#region Local ...
    //
    case XProject.ActionNames.getViewsResourceContents:
      result = await XProject.getViewsResourceContents();
      break;

    //
    case XProject.ActionNames.removeViewResource:
      result = await XProject.removeViewResource(message.payload);
      break;

    //
    case XProject.ActionNames.getViewsResources:
      result = await XProject.getViewsResources();
      break;

    //
    case XProject.ActionNames.createView:
      result = await XProject.createView(
        message.payload.viewName,
        message.payload.componentName
      );
      break;

    //
    case XProject.ActionNames.getViewContent:
      result = await XProject.getViewContent(message.payload);
      break;

    //
    case XProject.ActionNames.getViewContentPath:
      result = await XProject.getViewContentPath(message.payload);
      break;
    //#endregion

    //
    //#region OnWorkspace ...
    //
    case XProject.ActionNames.getViewsResourceContentsOnWorkspace:
      result = await XProject.getViewsResourceContentsOnWorkspace();
      break;

    //
    case XProject.ActionNames.removeViewResourceOnWorkspace:
      result = await XProject.removeViewResourceOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.getViewsResourcesOnWorkspace:
      result = await XProject.getViewsResourcesOnWorkspace();
      break;

    //
    case XProject.ActionNames.createViewOnWorkspace:
      result = await XProject.createViewOnWorkspace(
        message.payload.viewName,
        message.payload.componentName
      );
      break;

    //
    case XProject.ActionNames.getViewContentOnWorkspace:
      result = await XProject.getViewContentOnWorkspace(message.payload);
      break;

    //
    case XProject.ActionNames.getViewContentPathOnWorkspace:
      result = await XProject.getViewContentPathOnWorkspace(message.payload);
      break;
    //#endregion
    //#endregion

    //
    //#region Assets ...
    //
    case XProject.ActionNames.getDefaultAssetsResources:
      result = XProject.getDefaultAssetsResources();
      break;

    //
    //#region Local ...
    case XProject.ActionNames.getAssetsResourceContent:
      result = await XProject.getAssetsResourceContent();
      break;
    //#endregion

    //
    //#region OnWorkspace ...
    case XProject.ActionNames.getAssetsResourceContentOnWorkspace:
      result = await XProject.getAssetsResourceContentOnWorkspace();
      break;
    //#endregion
    //#endregion
    //#endregion

    //
    //#region NG File tools ...
    case XProject.ActionNames.isModule:
      result = await XProject.isModule(message.payload);
      break;

    case XProject.ActionNames.getImports:
      result = await XProject.getImports(message.payload);
      break;

    case XProject.ActionNames.isComponent:
      result = await XProject.isComponent(message.payload);
      break;

    case XProject.ActionNames.isDirective:
      result = await XProject.isDirective(message.payload);
      break;

    case XProject.ActionNames.isInjectable:
      result = await XProject.isInjectable(message.payload);
      break;

    case XProject.ActionNames.hasDecorator:
      result = await XProject.hasDecorator(message.payload);
      break;

    case XProject.ActionNames.extractToken:
      result = XProject.extractToken(
        message.payload.token,
        message.payload.content,
        message.payload.isArray
      );
      break;

    case XProject.ActionNames.addImportLine:
      result = await XProject.addImportLine(
        message.payload.objects,
        message.payload.importsFrom,
        message.payload.file,
      );
      break;

    case XProject.ActionNames.getDecoratorType:
      result = await XProject.getDecoratorType(message.payload);
      break;

    case XProject.ActionNames.getDecoratorTypes:
      result = XProject.getDecoratorTypes();
      break;

    case XProject.ActionNames.getDecoratorParts:
      result = XProject.getDecoratorParts();
      break;

    case XProject.ActionNames.getImportedModule:
      result = XProject.getImportedModule(message.payload);
      break;

    case XProject.ActionNames.getDecoratorObject:
      result = await XProject.getDecoratorObject(message.payload);
      break;

    case XProject.ActionNames.setDecoratorObject:
      result = await XProject.setDecoratorObject(
        message.payload.file,
        message.payload.decoratorObject,
      );
      break;

    case XProject.ActionNames.getImportedObjects:
      result = XProject.getImportedObjects(message.payload);
      break;

    case XProject.ActionNames.setImportedObjects:
      result = XProject.setImportedObjects(
        message.payload.objects,
        message.payload.importExpression,
      );
      break;

    case XProject.ActionNames.getImportedModules:
      result = XProject.getImportedModules(message.payload);
      break;

    case XProject.ActionNames.getDecoratorContent:
      result = await XProject.getDecoratorContent(message.payload);
      break;

    case XProject.ActionNames.addObjectsToDecorator:
      result = await XProject.addObjectsToDecorator(
        message.payload.objects,
        message.payload.importsFrom,
        message.payload.file,
        message.payload.addedTos,
      );
      break;
    //#endregion

    //
    //#region Project ...
    case XProject.ActionNames.prepareStructure:
      result = await XProject.prepareStructure();
      break;

    //
    //#region Command Checkers ...
    case XProject.ActionNames.isRequiredCommandsExists:
      result = await XProject.isRequiredCommandsExists();
      break;

    case XProject.ActionNames.getRequiredCommandsStates:
      result = await XProject.getRequiredCommandsStates();
      break;
    //#endregion

    //
    //#region On Workspace Paths ...
    case XProject.ActionNames.getAssetsPathOnWorkspace:
      result = XProject.getAssetsPathOnWorkspace();
      break;

    case XProject.ActionNames.getResourcesPathOnWorkspace:
      result = XProject.getResourcesPathOnWorkspace();
      break;

    case XProject.ActionNames.getPackResourcePathOnWorkspace:
      result = XProject.getPackResourcePathOnWorkspace();
      break;

    case XProject.ActionNames.getDataResourcePathOnWorkspace:
      result = XProject.getDataResourcePathOnWorkspace();
      break;

    case XProject.ActionNames.getPagesResourcePathOnWorkspace:
      result = XProject.getPagesResourcePathOnWorkspace();
      break;

    case XProject.ActionNames.getViewsResourcePathOnWorkspace:
      result = XProject.getViewsResourcePathOnWorkspace();
      break;
    //#endregion

    //
    //#region Project Paths ...
    case XProject.ActionNames.getProjectRootPath:
      result = XProject.getProjectRootPath(message.payload);
      break;

    case XProject.ActionNames.getProjectPlatformsFolderPath:
      result = XProject.getProjectPlatformsFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectPluginsFolderPath:
      result = XProject.getProjectPluginsFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectResourcesFolderPath:
      result = XProject.getProjectResourcesFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectSrcFolderPath:
      result = XProject.getProjectSrcFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectSslFolderPath:
      result = XProject.getProjectSslFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectAppFolderPath:
      result = XProject.getProjectAppFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectAssetsFolderPath:
      result = XProject.getProjectAssetsFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectEnvironmentFolderPath:
      result = XProject.getProjectEnvironmentFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectThemeFolderPath:
      result = XProject.getProjectThemeFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectConfigFolderPath:
      result = XProject.getProjectConfigFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectPageModuleFolderPath:
      result = XProject.getProjectPageModuleFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectSharedModuleFolderPath:
      result = XProject.getProjectSharedModuleFolderPath(message.payload);
      break;

    case XProject.ActionNames.getProjectViesModuleFolderPath:
      result = XProject.getProjectViesModuleFolderPath(message.payload);
      break;

    //
    case XProject.ActionNames.getProjectPackageFilePath:
      result = XProject.getProjectPackageFilePath(message.payload);
      break;
    //#endregion

    //
    //#region Project Tools ...
    case XProject.ActionNames.getProjectsFolderNames:
      result = XProject.getProjectsFolderNames();
      break;

    case XProject.ActionNames.getDefaultViewsForProject:
      result = XProject.getDefaultViewsForProject();
      break;

    case XProject.ActionNames.getDefaultPagesForProject:
      result = XProject.getDefaultPagesForProject();
      break;

    case XProject.ActionNames.getDefaultModulesForProject:
      result = XProject.getDefaultModulesForProject();
      break;

    case XProject.ActionNames.getDefaultDialogsForProject:
      result = XProject.getDefaultDialogsForProject();
      break;

    case XProject.ActionNames.updateProjectPackage:
      result = await XProject.updateProjectPackage(
        message.payload.name,
        message.payload.config
      );
      break;

    case XProject.ActionNames.getProjectPath:
      result = await XProject.getProjectPath(message.payload);
      break;
    //#endregion

    //
    //#region On Workspace Resources Preparers ...
    case XProject.ActionNames.refreshResourcesOnWorkspace:
      result = await XProject.refreshResourcesOnWorkspace();
      break;

    case XProject.ActionNames.preparePackOnWorkspace:
      result = await XProject.preparePackOnWorkspace();
      break;

    case XProject.ActionNames.prepareDataOnWorkspace:
      result = await XProject.prepareDataOnWorkspace();
      break;

    case XProject.ActionNames.prepareViewsOnWorkspace:
      result = await XProject.prepareViewsOnWorkspace();
      break;

    case XProject.ActionNames.preparePagesOnWorkspace:
      result = await XProject.preparePagesOnWorkspace();
      break;

    case XProject.ActionNames.prepareAssetsOnWorkspace:
      result = await XProject.prepareAssetsOnWorkspace();
      break;
    //#endregion
    //#endregion
  }

  //
  handleProjectsServiceActionResponse(message.sender, message.message, result);
}

function handleProjectsServiceActionResponse(reciever, actionName, response) {
  //
  if (!reciever || !actionName) {
    return;
  }

  //
  XLoggerTools.log(
    XLoggerTools.XLogMessage(
      XLoggerTools.XLogTag.Debug,
      `sending XProjects action: ${actionName}, result: ${response} ...`
    )
  );

  //
  sendMessage(
    new XElectronMessage(
      appId,
      reciever,
      actionName,
      response,
      XElectronChannel.ProjectsService
    )
  );
}
//#endregion
