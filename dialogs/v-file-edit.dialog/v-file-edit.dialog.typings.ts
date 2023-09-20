import {
  XOneOrManyType,
  XColorIdentifier,
  XColorWithBrightness,
} from 'x-framework-core';
import {
  XIDETheme,
  XTabAlign,
  XIDEActionModel,
  XIDEActionBarItem,
  XIDEDefaultTabName,
  XIDEThemeIdentifier,
  XTabAlignIdentifier,
  XIDEAvailableActionBarItem,
} from 'x-framework-components';
import { Subject } from 'rxjs';

//
export const VFileEditEmptyContent = 'VFILEEDITO[EMPTY]';

//
export enum VFileEditDialogCssVars {
  DialogToolbarHeight = 'dialog-toolbar-height',
}

//
export type IDETabInitDescriptor = {
  [name: string]: string;
};

//
export interface VFileEditDialogConfig {
  //
  actionProvider?: Subject<XIDEActionModel>;
  //
  defaultTabName?: string;
  theme?: XIDEThemeIdentifier;
  minLines?: number;
  maxLines?: number;
  fontSize?: number;
  readonly?: boolean;
  highlightActiveLine?: boolean;
  wordWrapping?: boolean;
  showLineNumbers?: boolean;
  showPrintMargin?: boolean;
  showFoldWidgets?: boolean;
  basicAutocompletion?: boolean;
  //
  defaultActionBarItemColor?: XColorIdentifier;
  availableActionBarItems?: XOneOrManyType<XIDEAvailableActionBarItem>;
  content?: string;
  //
  // Tabs ...
  alignTabs?: XTabAlignIdentifier;
  tabHeaderColor?: XColorIdentifier;
  activeTabColor?: XColorIdentifier;
  //
  // ActionBar ...
  showActionBar?: boolean;
  actionBarColor?: XColorIdentifier;
}

export const defaultFileEditDialogConfig: VFileEditDialogConfig = {
  //
  actionProvider: new Subject<XIDEActionModel>(),
  //
  defaultTabName: XIDEDefaultTabName,
  theme: XIDETheme.Dracula,
  minLines: 10,
  maxLines: Infinity,
  fontSize: 15,
  readonly: false,
  highlightActiveLine: true,
  wordWrapping: true,
  showLineNumbers: true,
  showPrintMargin: false,
  basicAutocompletion: true,
  //
  availableActionBarItems: [
    {
      actionId: XIDEActionBarItem.Close,
    },
    {
      actionId: XIDEActionBarItem.Undo,
    },
    {
      actionId: XIDEActionBarItem.Redo,
    },
    {
      actionId: XIDEActionBarItem.Beautify,
    },
    {
      actionId: XIDEActionBarItem.ChangeTheme,
    },
  ],
  content: '',
  //
  alignTabs: XTabAlign.STRETCH,
  tabHeaderColor: XColorWithBrightness.Primary,
  activeTabColor: XColorWithBrightness.Warning,
  //
  showActionBar: true,
  defaultActionBarItemColor: XColorWithBrightness.Light,
  actionBarColor: XColorWithBrightness.Primary,
};
