import { connect, registerFormField } from '@formily/antd';
import { dynamic } from 'umi';
import type { ConvenientDateRangeProps } from '@/components/Library/ConvenientDateRange';

const ConvenientDateRange = dynamic({
  // eslint-disable-next-line max-len
  loader: () =>
    import(
      /* webpackChunkName: 'schema-field-convenientDateRange' */ '@/components/Library/ConvenientDateRange'
    ),
});

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalFormSchemaComponentType {
    convenientDateRange: ConvenientDateRangeProps;
  }
}

registerFormField('convenientDateRange', connect()(ConvenientDateRange));

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
