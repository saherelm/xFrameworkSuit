import {
  XFileType,
  XResourceIDs,
  downloadFileByUrl,
  isNullOrEmptyString,
  XResourceIdentifier,
} from 'x-framework-core';
import { XFileDto } from './v-file.model';

export function getFileTypeResourceId(type: XFileType) {
  //
  let resourceId: XResourceIdentifier = XResourceIDs.unknown;

  //
  switch (type) {
    //
    case XFileType.Audio:
      resourceId = XResourceIDs.audio;
      break;

    //
    case XFileType.CoverImage:
      resourceId = XResourceIDs.cover_image;
      break;

    //
    case XFileType.Document:
      resourceId = XResourceIDs.document;
      break;

    //
    case XFileType.Image:
      resourceId = XResourceIDs.image;
      break;

    //
    case XFileType.Video:
      resourceId = XResourceIDs.video;
      break;

    //
    case XFileType.ProfileImage:
      resourceId = XResourceIDs.avatar;
      break;
  }

  //
  return resourceId;
}

export function getFileDtoTypeResourceId(model: XFileDto) {
  //
  if (!model) {
    return XResourceIDs.unknown;
  }

  //
  return getFileTypeResourceId(model.type);
}

export function downloadFile(model: XFileDto) {
  //
  if (
    !model ||
    isNullOrEmptyString(model.path) ||
    isNullOrEmptyString(model.name)
  ) {
    return;
  }

  //
  downloadFileByUrl(model.path, model.name);
}
