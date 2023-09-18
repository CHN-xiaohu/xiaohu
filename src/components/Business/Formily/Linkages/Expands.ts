import type {
  FormPathPattern,
  ISchemaFormActions,
  IFormActions,
  IFormAsyncActions,
} from '@formily/antd';
import { useValueLinkageEffect } from '@formily/antd';
import { isFn } from '@/utils';

// ISchema['x-linkages']
type XLinkages<T = FormPathPattern> = {
  name: T;
  target: FormPathPattern;
  condition: string;
  type: string;
  [key: string]: any;
};

export type TXLinkages = (
  | XLinkages<'value:visible'>
  | XLinkages<'value:schema'>
  | XLinkages<'value:state'>

  // 自己拓展的
  | XLinkages<'value:disabled'>
  | XLinkages<'value:display'>
  | XLinkages<'value:loading'>
  | XLinkages<'value:value'>
  | { type: 'value:effect'; effect: (actions: IFormActions | IFormAsyncActions) => void }
)[];

// declare global {
//   interface GlobalFormSchemaLinkages {
//     // 内置
//     ['value:visible']?: XLinkages;
//     ['value:schema']?: XLinkages;
//     ['value:state']?: XLinkages;

//     // 自己拓展的
//     ['value:disabled']?: XLinkages;
//     ['value:display']?: XLinkages;
//     ['value:loading']?: XLinkages;
//     ['value:value']?: XLinkages;
//     ['value:effect']?: {
//       effect: (actions: IFormActions | IFormAsyncActions) => void
//     };
//   }
// }

type LinkageParams = {
  type: string;
  condition: any;
  complie: (path: FormPathPattern, scope?: any) => any;
  [key: string]: any;
};

type LinkageItem = {
  type?: string;
  resolve?: (params: LinkageParams, actions: ISchemaFormActions) => void;
  reject?: (params: LinkageParams, actions: ISchemaFormActions) => void;
  scope?: any;
};

export const useLinkageEffect = (scope?: any) => {
  const linkages = ['disabled', 'display', 'loading'];
  const linkageTypes = {} as {
    [k in 'display' | 'disabled' | 'loading']: LinkageItem;
  };

  linkages.forEach((type) => {
    linkageTypes[type] = {
      type: `value:${type}`,
      resolve: ({ target }, { setFieldState }) => {
        setFieldState(target, (innerState) => {
          innerState[type] = true;
        });
      },
      reject: ({ target }, { setFieldState }) => {
        setFieldState(target, (innerState) => {
          innerState[type] = false;
        });
      },
      scope,
    } as LinkageItem;
  });

  useValueLinkageEffect(linkageTypes.disabled);
  useValueLinkageEffect(linkageTypes.display);
  useValueLinkageEffect(linkageTypes.loading);

  useValueLinkageEffect({
    type: 'value:value',
    resolve: (p, { setFieldState }) => {
      console.log(p);
      setFieldState(p.target, (innerState) => {
        innerState.value = true;
      });
    },
    reject: ({ target }, { setFieldState }) => {
      setFieldState(target, (innerState) => {
        innerState.value = false;
      });
    },
    scope,
  });

  useValueLinkageEffect({
    type: 'value:effect',
    resolve: ({ effect }, actions) => {
      if (isFn(effect)) {
        effect(actions);
      }
    },
    scope,
  });
};
