/* eslint-disable import/no-extraneous-dependencies */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileDialogButtonView from '@ckeditor/ckeditor5-upload/src/ui/filedialogbuttonview';

const componentFactoryName = 'uploadPicture';

export class UI extends Plugin {
  init() {
    const { editor } = this;
    // const { t } = editor;

    editor.ui.componentFactory.add(componentFactoryName, (locale) => {
      const fileUploadView = new FileDialogButtonView(locale);

      fileUploadView.set({
        acceptedType: 'image/*',
        allowMultipleFiles: true,
      });

      fileUploadView.buttonView.set({
        label: '上传图片',
        withText: true,
        tooltip: true,
      });

      fileUploadView.on('done', (evt, files) => {
        const options = editor.config.get(componentFactoryName) || {};
        if (options.customUploadRequest && typeof options.customUploadRequest === 'function') {
          options.customUploadRequest(editor, files);
        }
      });

      return fileUploadView;
    });
  }
}
