import { mapStyledProps, connect, registerFormField } from '@formily/antd';
import type { IAreaProps } from '@/components/Library/Area';

import { dynamic } from 'umi';

const Area = dynamic({
  loader: () => import(/* webpackChunkName: 'schema-field-area' */ '@/components/Library/Area'),
});

declare global {
  interface GlobalFormSchemaComponentType {
    area: IAreaProps;
  }
}

registerFormField(
  'area',
  connect({
    getProps: mapStyledProps,
  })(Area),
);

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
