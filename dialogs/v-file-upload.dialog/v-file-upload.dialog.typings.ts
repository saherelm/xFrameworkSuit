import { XOneOrManyType } from 'x-framework-core';
import { DefaultActionBarItemIdsIdentifier } from 'x-framework-components';

//
export enum VFileUploadDialogCssVars {
  DialogToolbarHeight = 'dialog-toolbar-height',
}

//
export interface VFileUploadDialogConfig {
  maxAllowedFiles?: number;
  showFileDropArea?: boolean;
  minAllowedFileSize?: number;
  allowedExtensions?: XOneOrManyType<string>;
  hideActions?: XOneOrManyType<DefaultActionBarItemIdsIdentifier>;
}

export const defaultFileUploadDialogConfig: VFileUploadDialogConfig = {
  maxAllowedFiles: 40,
  minAllowedFileSize: 0,
  showFileDropArea: true,
  hideActions: undefined,
  allowedExtensions: undefined,
};
