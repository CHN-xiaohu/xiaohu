import { connect, registerFormField } from '@formily/antd';
import type { Props } from '@/components/Library/InputNumber';
import { InputNumber } from '@/components/Library/InputNumber';
import { mapStyledProps } from '@/components/Business/Formily/Utils/mapStyledProps';

declare global {
  interface GlobalFormSchemaComponentType {
    inputNumber: Props;
  }
}

registerFormField(
  'inputNumber',
  connect({
    getProps: mapStyledProps,
  })(InputNumber),
);
