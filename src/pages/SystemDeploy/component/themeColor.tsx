import { Radio } from 'antd';

// eslint-disable-next-line import/no-extraneous-dependencies
import type { RadioButtonProps } from 'antd/lib/radio/radioButton';

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

const ThemeColor = (props: IRadioGroupProps) => {
  const { dataSource = [], fieldNames = {}, ...lastProps } = props;

  const fieldNameFiels = {
    value: 'value',
    label: 'label',
    ...fieldNames,
  };

  return (
    <Radio.Group {...lastProps}>
      {dataSource.map((item) => (
        <Radio.Button
          style={{ margin: '10px' }}
          key={item[fieldNameFiels.value]}
          value={item[fieldNameFiels.value]}
        >
          <img src={item[fieldNameFiels.label]} style={{ paddingBottom: '2px' }} alt="" />
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};

export default ThemeColor;
