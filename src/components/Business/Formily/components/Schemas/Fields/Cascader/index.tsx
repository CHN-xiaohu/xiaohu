import { mapStyledProps, mapTextComponent, connect, registerFormField } from '@formily/antd';

import { Cascader } from 'antd';
import type { CascaderProps } from 'antd/lib/cascader';

declare global {
  interface GlobalFormSchemaComponentType {
    cascader: CascaderProps;
  }
}

registerFormField(
  'cascader',
  connect({
    getProps: mapStyledProps,
    getComponent: mapTextComponent,
  })(Cascader),
);

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
