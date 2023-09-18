import { mapStyledProps, connect, registerFormFields } from '@formily/antd';
import type { Props } from '@/components/Library/Upload';
import { UploadSection } from '@/components/Library/Upload';
import type { Props as UploadVideoProps } from '@/components/Library/Upload/Video';
import { UploadVideo } from '@/components/Library/Upload/Video';

declare global {
  interface GlobalFormSchemaComponentType {
    uploadFile: Props;
    uploadVideo: UploadVideoProps;
  }
}

registerFormFields({
  uploadFile: connect({
    getProps: mapStyledProps,
  })(UploadSection),

  uploadVideo: connect({
    getProps: mapStyledProps,
  })(UploadVideo),
});
