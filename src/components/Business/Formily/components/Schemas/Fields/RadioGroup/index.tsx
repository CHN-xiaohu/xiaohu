/* eslint-disable react/require-default-props */
import { memo } from 'react';
import { Radio } from 'antd';
import type { RadioButtonProps } from 'antd/lib/radio/radioButton';

import { connect, registerFormField } from '@formily/antd';

export type FieldNamesType = {
  value?: string;
  label?: string;
};

type IRadioGroupProps = {
  value?: string | number;
  dataSource: (FieldNamesType & { value: any })[];
  fieldNames?: FieldNamesType;
  onChange?: (value: any) => void;
} & RadioButtonProps;

declare global {
  interface GlobalFormSchemaComponentType {
    radioGroup: Omit<IRadioGroupProps, 'value' | 'onChange'>;
  }
}

const Wrapper = memo((props: IRadioGroupProps) => {
  const { dataSource = [], fieldNames = {}, ...lastProps } = props;

  const fieldNameFields = {
    value: 'value',
    label: 'label',
    ...fieldNames,
  };

  return (
    <Radio.Group buttonStyle="solid" {...lastProps}>
      {dataSource.map((item) => (
        <Radio.Button key={item[fieldNameFields.value]} value={item[fieldNameFields.value]}>
          {item[fieldNameFields.label]}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
});

registerFormField('radioGroup', connect()(Wrapper));

// fix https://github.com/umijs/umi/issues/6766 Module parse failed: Top-Level-Await 报错
export {};
