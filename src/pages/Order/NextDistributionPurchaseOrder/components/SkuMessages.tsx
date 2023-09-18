import React from 'react';

import { Form, Input } from 'antd';
import type { InputProps } from 'antd/es/input';
import type { FormItemProps } from 'antd/lib/form';
import type { InputNumberProps } from 'antd/lib/input-number';
import { InputNumber } from '@/components/Library/InputNumber';

export interface IInputNumberProps extends InputNumberProps {
  addonBefore?: InputProps['addonBefore'];
  addonAfter?: InputProps['addonBefore'];
}

type TComponentType = {
  string: InputProps;
  number: IInputNumberProps;
  preview: AnyObject;
};

export type TMessageFields<T extends keyof TComponentType> = AnyObject<
  FormItemProps & {
    type: T;
    componentProps: TComponentType[T] & {
      readOnly?: boolean;
    };
  }
>;

export interface ISkuMessagesProps {
  fields?: TMessageFields<keyof TComponentType>;
  defaultValue?: AnyObject<string>;
}

export const SkuMessages = ({ fields = {}, defaultValue }: ISkuMessagesProps) => {
  return (
    <>
      {Object.keys(fields)?.map((fieldKey) => {
        const { componentProps, type, children, ...lastProps } = fields[fieldKey];
        const { readOnly, ...lastComponentProps } = componentProps;

        const Component = {
          string: Input,
          number: InputNumber,
          preview: React.memo(({ value, onChange }: AnyObject) => {
            React.useEffect(() => {
              // 防止 value 是一个对象的情况，不然可能会导致死循环
              onChange(value);
            }, [value]);

            return <span>{value}</span>;
          }),
        }[type] as any;

        return (
          <Form.Item
            className="nonStandardInput"
            key={fieldKey}
            wrapperCol={{
              span: 6,
            }}
            validateFirst
            {...lastProps}
          >
            {children ||
              (readOnly ? (
                <span>{lastProps.initialValue || defaultValue?.[fieldKey]}</span>
              ) : (
                <Component {...lastComponentProps} />
              ))}
          </Form.Item>
        );
      })}
    </>
  );
};
