import { createVirtualBox, Submit } from '@formily/antd';
import type { ButtonProps } from 'antd/lib/button';

declare global {
  interface GlobalFormSchemaComponentType {
    submitButton: ButtonProps;
  }
}

createVirtualBox<React.PropsWithChildren<ButtonProps>>('submitButton', Submit);

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
