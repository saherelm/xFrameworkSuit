import { XBaseActionModel } from 'x-framework-components';

export enum VBaseFormViewPresentType {
  AsForm = 'as_form',
  AsDescriptionList = 'as_description_list',
}

export type VBaseFormViewPresentTypeIdentifier =
  | VBaseFormViewPresentType
  | string;

export enum VBaseFormViewAction {
  //
  Refresh = 'refresh',
  SetError = 'set_error',
  ClearError = 'clear_error',
  ClearForm = 'clear_form',
  ResetForm = 'reset_form',
}

export type VBaseFormViewActionIdentifier = VBaseFormViewAction | string;

export interface VBaseFormViewActionModel
  extends XBaseActionModel<VBaseFormViewActionIdentifier> {}
