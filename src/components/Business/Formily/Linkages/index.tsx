import type { ISchema } from '@formily/antd';
import { createFormActions, FormPath } from '@formily/antd';

export * from './Expands';

type IParams = {
  fatherPath?: string;
};

export const createLinkageUtils = (params: IParams = {}) => {
  const { fatherPath = '' } = params;
  const actions = createFormActions();

  function linkage<T = any>(key: string, defaultValue?: T) {
    return (path: string, value: T) =>
      actions.setFieldState(FormPath.parse(fatherPath).concat(path).toString(), (state) => {
        FormPath.setIn(state, key, value ?? defaultValue);
      });
  }

  const x = <S extends string>(key: string) => (path: string, propName: S, value: any) =>
    actions.setFieldState(path, (state) => {
      FormPath.setIn(state, FormPath.parse(key).concat(propName), value);
    });

  return {
    hide: linkage<boolean>('visible', false),
    show: linkage<boolean>('visible', true),
    visible: linkage<boolean>('visible'),
    display: linkage<boolean>('display', true),
    loading: linkage<boolean>('loading', true),
    closeLoading: linkage<boolean>('loading', false),
    editable: linkage<boolean>('editable', true),
    value: linkage('value'),
    xProp: x('props.x-props'),
    prop: x<keyof ISchema>('props'),
    errors: linkage<string | string[]>('errors'),
    xComponentProp: x('props.x-component-props'),
    ...actions,
    actions,
  };
};

export type TCreateLinkageUtils = ReturnType<typeof createLinkageUtils>;
