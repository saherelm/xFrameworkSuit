import {
  XFileType,
  formatDate,
  getFieldNames,
  XModelKeyProvider,
  XModelValueProvider,
  getDateFormatString,
  XResourceIdentifier,
  XModelFieldTypeIndex,
  getFileTypeResourceId,
  XPartialModelFieldNames,
} from 'x-framework-core';
import { XThumbnailType } from 'x-framework-components';
import { VBaseFormViewComponent } from '../classes/v-base-form-view';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { defaultFileDto, prepareFileDtoFields, XFileDto } from './v-file.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'v-file',
  templateUrl: './v-file.component.html',
  styleUrls: ['./v-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VFileComponent extends VBaseFormViewComponent<XFileDto> {
  //
  //#region Props ...
  //
  cardShowActions = true;

  //
  readonly FileTypes = Object.assign({}, XFileType);
  readonly ThumbnailTypes = Object.assign({}, XThumbnailType);

  //
  model = {
    ...defaultFileDto,
  };
  readonly defaultModel = {
    ...defaultFileDto,
  };
  modelFieldPreparer: (model: XFileDto) => XFileDto = prepareFileDtoFields;
  readonly FieldNames: XModelFieldTypeIndex<XFileDto> =
    getFieldNames(defaultFileDto);

  //
  @Input()
  title: string = this.resourceProvider(this.AppResourceIDs.document);
  //#endregion

  //
  //#region LifeCycles ...
  //#endregion

  //
  //#region Handlers ...
  //#endregion

  //
  //#region UI Providers ...
  //#endregion

  //
  //#region UI Handlers ...
  //#endregion

  //
  //#region Actions ...
  //#endregion

  //
  //#region Abstract ...
  async prepareFormConfig(): Promise<void> {
    this.formConfig = null;
  }

  defaultSortOrderModelKeys(): XPartialModelFieldNames<XFileDto> {
    return [
      'id',
      'authorId',
      'name',
      'type',
      'path',
      'thumb',
      'thumbPath',
      'uploadedOn',
    ];
  }

  defaultHiddenModelKeys(): XPartialModelFieldNames<XFileDto> {
    return [];
  }

  defaultHiddenLabelModelKeys(): XPartialModelFieldNames<XFileDto> {
    return [];
  }

  defaultModelKeyProvider(): XModelKeyProvider<XFileDto> {
    return (key) => {
      //
      let resourceId: XResourceIdentifier = '';

      //
      switch (key) {
        //
        case 'id':
          resourceId = this.ResourceIDs.id;
          break;

        //
        case 'authorId':
          resourceId = this.AppResourceIDs.author_id;
          break;

        //
        case 'name':
          resourceId = this.AppResourceIDs.name;
          break;

        //
        case 'path':
          resourceId = this.AppResourceIDs.path;
          break;

        //
        case 'thumb':
          resourceId = this.ResourceIDs.thumbnail;
          break;

        //
        case 'thumbPath':
          resourceId = this.ResourceIDs.thumbnail;
          break;

        //
        case 'type':
          resourceId = this.AppResourceIDs.type;
          break;

        //
        case 'uploadedOn':
          resourceId = this.AppResourceIDs.uploaded_on;
          break;
      }

      //
      return this.resourceProvider(resourceId);
    };
  }

  defaultModelValueProvider(): XModelValueProvider<XFileDto> {
    return (key, value) => {
      //
      switch (key) {
        //
        case 'id':
          value = this.applyLocale(value);
          break;

        //
        case 'uploadedOn':
          value = formatDate(
            value,
            this.managerService.currentLocale,
            getDateFormatString(this.managerService.currentLocale),
            true
          );
          break;

        //
        case 'type':
          value = this.resourceProvider(getFileTypeResourceId(value));
          break;
      }

      //
      return value;
    };
  }
  //#endregion

  //
  //#region Private ...
  //#endregion
}
