/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 基于底层的 UploadSection 来做定制的 sku table 的图片上传
|
*/

import * as React from 'react';
import { useDebounceEffect } from 'ahooks';
import type { Props as UploadSectionProps } from '@/components/Library/Upload';
import { UploadSection } from '@/components/Library/Upload';
import { ButtonList } from '@/components/Library/ButtonList';
import { usePreviewPicture } from '@/components/Library/PreviewPicture';
import { Image } from '@/components/Business/Table/Image';
import { notEmpty } from '@/utils';

export type Props = {
  readOnly?: boolean;
} & UploadSectionProps;

export const TableUploadImage: React.FC<Props> = React.memo(
  ({ value, defaultValue, onChange, readOnly, ...lastProps }) => {
    const [filePath, setFilePath] = React.useState('');
    const { open: previewPicture } = usePreviewPicture();

    useDebounceEffect(
      () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        notEmpty(value) && value !== filePath && setFilePath(String(value));
      },
      [value],
      { wait: 300 },
    );

    const handleChange = React.useCallback(
      (src: any) => {
        onChange?.(src);
        setFilePath(src);
      },
      [onChange],
    );

    const handleRemove = React.useCallback(() => {
      handleChange('');
      setFilePath('');
    }, [handleChange]);

    const handlePreview = React.useCallback(() => {
      previewPicture({
        src: filePath as string,
        title: filePath,
        subtitle: '',
      });
    }, [filePath]);

    if (readOnly) {
      return filePath ? <Image src={filePath} /> : <span />;
    }

    return (
      <>
        {filePath ? (
          <>
            <ButtonList
              isLink
              isDivider
              list={[
                { text: '查看图片', onClick: handlePreview },
                { text: '删除图片', danger: true, onClick: handleRemove },
              ]}
            />
          </>
        ) : (
          <UploadSection
            {...{
              ...lastProps,
              listType: 'text',
              showUploadList: false,
              onChange: handleChange,
            }}
          >
            <a>上传图片</a>
          </UploadSection>
        )}
      </>
    );
  },
);
