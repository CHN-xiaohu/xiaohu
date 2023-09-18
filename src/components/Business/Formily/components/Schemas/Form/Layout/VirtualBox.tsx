import * as React from 'react';
import { createVirtualBox } from '@formily/antd';

type Props = {
  //
};

declare global {
  interface GlobalFormSchemaComponentType {
    virtualBox: string;
  }
}

export const Wrapper: React.FC<Props> = ({ children }) => <>{children}</>;

createVirtualBox('virtualBox', Wrapper);
