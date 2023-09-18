import { useCallback } from 'react';
import { Avatar } from 'antd';
import type { AvatarProps } from 'antd/es/avatar';

import { usePreviewPicture } from '@/components/Library/PreviewPicture';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ImageProps extends AvatarProps {
  //
}

export const Image = (props: ImageProps) => {
  const { open: openPreviewPicture } = usePreviewPicture();

  // 预览
  const handlePreview = useCallback(() => {
    if (!props.src) {
      return;
    }

    openPreviewPicture({
      src: props.src as string,
      title: '',
      subtitle: '',
    });
  }, [openPreviewPicture, props.src]);

  return (
    <Avatar
      {...{
        shape: 'square',
        size: 'large',
        onClick: handlePreview,
        style: {
          cursor: 'pointer',
        },
        ...props,
      }}
    />
  );
};
