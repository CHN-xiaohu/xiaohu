import * as React from 'react';
import { createVirtualBox } from '@formily/antd';

type Props = {
  //
};

declare global {
  interface GlobalFormSchemaComponentType {
    emptyPlaceholder: string;
  }
}

export const Wrapper: React.FC<Props> = () => <div>&nbsp;</div>;
createVirtualBox('emptyPlaceholder', Wrapper);
