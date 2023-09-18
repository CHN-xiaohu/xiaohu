/* eslint-disable @typescript-eslint/consistent-type-definitions */
/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 对 formily 的 SchemaForm 做简单封装
|
*/

import type {
  IAntdSchemaFormProps,
  IFieldState as IFormilyFieldState,
  ISchema,
  ISchemaFormProps,
} from '@formily/antd';
import { SchemaForm as FormilySchemaForm } from '@formily/antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import type { ValidatePatternRules } from '@formily/validator';

// todo: Formily v1 版本删除了对封装的 field 的 typescript 定义，这里先临时补上
import { QuestionCircleOutlined } from '@ant-design/icons';

import { Tooltip } from 'antd';

import { createElement } from 'react';

import type { InternalFieldTypes } from './Registry';
import { setup } from './Registry';

import type { TXLinkages } from '../Linkages';
import { useLinkageEffect } from '../Linkages';

type TGlobalFormSchemaComponentProps = GlobalFormSchemaComponentType & InternalFieldTypes;
type TGlobalFormSchemaComponentType = keyof TGlobalFormSchemaComponentProps;

type XProps<T> = T extends TGlobalFormSchemaComponentType
  ? TGlobalFormSchemaComponentProps[T] & {
      itemClassName?: string;
      addonAfter?: React.ReactNode;
      itemStyle?: React.CSSProperties;
    }
  : Record<string, any>;

type XComponentProps<C> = C extends keyof GlobalDefaultFormSchemaLayouts
  ? GlobalDefaultFormSchemaLayouts[C]
  : Record<string, any>;

type XComponent = keyof GlobalDefaultFormSchemaLayouts;

type XRules = ValidatePatternRules | GlobalFormSchemaRules | GlobalFormSchemaRules[];

export type IFieldState = IFormilyFieldState<FormilyCore.FieldProps>;

export interface Schema<
  T extends TGlobalFormSchemaComponentType,
  C extends GlobalDefaultFormSchemaLayouts,
> extends Omit<
    ISchema,
    'x-props' | 'x-component' | 'x-component-props' | 'x-effect' | 'x-render' | 'x-linkages'
  > {
  type?: T;
  placeholder?: string | React.ReactNode;
  props?: XProps<T>;
  ['x-props']?: XProps<T>;

  ['x-component']?: XComponent;

  ['x-component-props']?: XProps<T> & XComponentProps<C>;

  ['x-rules']?: XRules;

  // Omit 没有能将 x-linkages 剔掉，应该是 ts 的 bug, 所以先用交叉类型来跳一下
  ['x-linkages']?: ISchema['x-linkages'] & TXLinkages;

  properties?: Record<string, Schema<T, C>>;
}

export type TSchema = Schema<TGlobalFormSchemaComponentType, GlobalDefaultFormSchemaLayouts>;

export type TSchemas<S = AnyObject> = Record<string, TSchema> | S;

export interface SchemaFormProps<S = AnyObject>
  extends Omit<IAntdSchemaFormProps, 'fields'>,
    Pick<ISchemaFormProps, 'fields'> {
  schema?: TSchemas<S>;
}

// 注入默认 UI 组件
setup();

const createDefaultRichTextUtils = () => {
  return {
    text(...args: any) {
      return createElement('span', {}, ...args);
    },

    help(tip: string | React.ReactNode, opts: { children?: string; style?: React.CSSProperties }) {
      const { children, style = {} } = opts || {};

      return (
        <Tooltip title={tip}>
          {children}
          <QuestionCircleOutlined
            style={{ marginLeft: 8, marginRight: '-8px', cursor: 'pointer', ...style }}
          />
        </Tooltip>
      );
    },
  };
};

export const SchemaForm: React.FC<SchemaFormProps> = (props) => {
  const { schema: properties, ...last } = props;

  return (
    <FormilySchemaForm
      validateFirst
      schema={{
        type: 'object',
        properties,
      }}
      {...(last as any)}
      expressionScope={{
        ...createDefaultRichTextUtils(),
        ...(last.expressionScope || {}),
      }}
      effects={(selector, actions) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useLinkageEffect();

        last.effects?.(selector, actions);
      }}
    />
  );
};
