import { UploadStorage } from '@/services/Upload';

import { useCallback, useMemo } from 'react';

import Editor from 'ckeditor5-custom-build/build/ckeditor';

import { CKEditor as CKEditorComponent, editorConfiguration } from './CKEditor';

import { isImage } from '../../Upload/Util';

type Props = {
  height?: number;
  value?: string;
  isDetail?: boolean;
  onChange?: (value: string) => void;
};

const detailConfiguration = {
  toolbar: {
    options: {
      shouldGroupWhenFull: true,
    },
  },
};

export const CKEditor = ({ isDetail = false, ...lastProps }: Props) => {
  // 选择图片
  const handleCustomUploadRequest = useCallback(async (editor: any, files: FileList) => {
    const fileUrls = await Promise.all(
      Array.from(files).map((file) => UploadStorage.uploadFile<string>(file)),
    );

    // 如果当前鼠标选区是图片，那么就说明是替换
    if (isImage(editor.model.document.selection.getSelectedElement())) {
      const [first, ...lastUrl] = fileUrls;
      editor.model.change((writer: any) => {
        const imageElement = writer.createElement('image', {
          src: first,
        });

        editor.model.insertContent(imageElement, editor.model.document.selection);

        if (lastUrl.length) {
          lastUrl.forEach((src) => {
            writer.append(
              writer.createElement('image', {
                src,
              }),
              editor.model.document.selection.focus.parent,
            );
          });
        }
      });
    } else {
      // 利用 image 插件的 imageInsert 命令来批量插入图片
      editor.execute('imageInsert', {
        source: fileUrls,
      });
    }
  }, []);

  const chooseConfiguration = useMemo(
    // eslint-disable-next-line no-confusing-arrow
    () => (isDetail ? detailConfiguration : editorConfiguration),
    [isDetail],
  );

  return (
    <CKEditorComponent
      disabled={isDetail}
      {...{
        ...lastProps,
        editorClass: Editor,
        configuration: {
          ...chooseConfiguration,
          uploadPicture: {
            customUploadRequest: handleCustomUploadRequest,
          },
        },
      }}
    />
  );
};

export default CKEditor;
