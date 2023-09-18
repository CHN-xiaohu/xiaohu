import { mapStyledProps, connect, registerFormField } from '@formily/antd';

import type { IAddressProps } from '@/components/Library/Address';
import { Address } from '@/components/Library/Address';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalFormSchemaComponentType {
    address: IAddressProps;
  }
}

registerFormField(
  'address',
  connect({
    getProps: mapStyledProps,
  })(Address),
);
