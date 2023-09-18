import { mapStyledProps, connect, registerFormField } from '@formily/antd';
import type { ButtonListProps } from '@/components/Library/ButtonList';
import { ButtonList } from '@/components/Library/ButtonList';

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface GlobalFormSchemaComponentType {
    buttonList: ButtonListProps;
  }
}

registerFormField(
  'buttonList',
  connect({
    getProps: mapStyledProps,
  })(ButtonList),
);
