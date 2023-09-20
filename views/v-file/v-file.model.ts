import {
    isDate,
    isString,
    XFileType,
    fromUtcDate,
    isSameObject,
    XBaseDtoHelper,
    XBaseNumberIDDto,
    isNullOrUndefined,
    isNullOrEmptyString,
  } from 'x-framework-core';
  
  //
  //#region XFile ...
  export interface XFileDto extends XBaseNumberIDDto {
    //
    authorId: string;
    type?: XFileType;
    name: string;
    thumb?: string;
    path: string;
    thumbPath?: string;
    uploadedOn: Date;
  }
  
  export const defaultFileDto: XFileDto = {
    //
    id: 0,
  
    //
    type: undefined,
    authorId: '',
    name: '',
    thumb: undefined,
    path: '',
    thumbPath: '',
    uploadedOn: undefined,
  };
  
  export function prepareFileDtoFields(model?: XFileDto) {
    //
    if (!model) {
      model = {
        ...defaultFileDto,
      };
    }
  
    //
    model = {
      ...defaultFileDto,
  
      //
      id: !isNullOrUndefined(model.id) ? model.id : defaultFileDto.id,
  
      //
      type: !isNullOrUndefined(model.type) ? model.type : defaultFileDto.type,
  
      //
      authorId: model.authorId || defaultFileDto.authorId,
      name: model.name || defaultFileDto.name,
      thumb: model.thumb || defaultFileDto.thumb,
      path: model.path || defaultFileDto.path,
      thumbPath: model.thumbPath || defaultFileDto.thumbPath,
  
      //
      uploadedOn:
        isString(model.uploadedOn) &&
        !isNullOrEmptyString(model.uploadedOn.toString())
          ? fromUtcDate(model.uploadedOn)
          : isDate(model.uploadedOn)
          ? model.uploadedOn
          : isString(defaultFileDto.uploadedOn) &&
            !isNullOrEmptyString(defaultFileDto.uploadedOn.toString())
          ? fromUtcDate(defaultFileDto.uploadedOn)
          : isDate(defaultFileDto.uploadedOn)
          ? defaultFileDto.uploadedOn
          : null,
    };
  
    //
    return model;
  }
  
  export function isDefaultFileDto(model?: XFileDto) {
    return isSameObject(prepareFileDtoFields(model), defaultFileDto);
  }
  
  export class XFileHelper extends XBaseDtoHelper<XFileDto> implements XFileDto {
    //
    //#region Props ...
    id: number;
    authorId: string;
    type?: XFileType;
    name: string;
    thumb?: string;
    path: string;
    thumbPath?: string;
    uploadedOn: Date;
    //#endregion
  
    //
    //#region Abstracts ...
    defaultValues: XFileDto = {
      ...defaultFileDto,
    };
  
    get values(): XFileDto {
      return this.prepareModelFields({
        id: this.id,
        authorId: this.authorId,
        type: this.type,
        name: this.name,
        thumb: this.thumb,
        path: this.path,
        thumbPath: this.thumbPath,
        uploadedOn: this.uploadedOn,
      });
    }
  
    prepareModelFields(dto?: XFileDto): XFileDto {
      return prepareFileDtoFields(dto);
    }
  
    fill(dto?: XFileDto): void {
      //
      if (!dto) {
        dto = {
          ...this.defaultValues,
        };
      }
  
      //
      dto = this.prepareModelFields(dto);
  
      //
      this.id = dto.id;
      this.authorId = dto.authorId;
      this.type = dto.type;
      this.name = dto.name;
      this.thumb = dto.thumb;
      this.path = dto.path;
      this.thumbPath = dto.thumbPath;
      this.uploadedOn = dto.uploadedOn;
    }
    //#endregion
  }
  //#endregion
  
  export interface XFileUploadResponseDto extends XFileDto {
    fileName: string;
  }
  