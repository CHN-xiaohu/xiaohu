// eslint-disable-next-line import/no-extraneous-dependencies
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { Editing } from './Editing';
import { UI } from './UI';

/**
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/tutorials/implementing-a-block-widget.html
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/tutorials/implementing-an-inline-widget.html#demo
 */
export class UploadPicture extends Plugin {
  static get requires() {
    return [Editing, UI];
  }

  static get pluginName() {
    return 'UploadPicture';
  }
}
