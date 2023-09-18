import type { MergedFieldComponentProps } from '@formily/antd';
import { mapStyledProps as mapStyledPropsAsFormily } from '@formily/antd';

import { isObj } from '@/utils';

export const mapStyledProps = (props: AnyObject, fieldProps: MergedFieldComponentProps) => {
  if (fieldProps.rules) {
    fieldProps.rules.forEach((item) => {
      /**
        * @example
          field: {
            'x-rules': [{ required: true, message: '请输入标题' }],
          }
          ====>
          field: {
            x-component-props: {
              placeholder: '请输入标题',
            }
            'x-rules': [{ required: true, message: '请输入标题' }],
          }
       */
      if (
        isObj(item) &&
        (item as any).required &&
        (item as any).message &&
        !(props as any).placeholder
      ) {
        (props as any).placeholder = (item as any).message;
      }
    });
  }

  mapStyledPropsAsFormily(props, fieldProps);
};
