/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 基于 formily 封装一个取消的按钮，主要是获取 Form status 状态
|
*/

import { Button } from 'antd';
import type { ButtonProps } from 'antd/es/button/button';

import { FormSpy, LifeCycleTypes, createVirtualBox } from '@formily/antd';
import type { ISubmitProps } from '@formily/antd-components/esm/types';

declare global {
  interface GlobalFormSchemaComponentType {
    cancelButton: ISubmitProps & ButtonProps;
  }
}

export const formSubmitLifeCycleFromFormSpy = () => ({
  selector: [LifeCycleTypes.ON_FORM_SUBMIT_START, LifeCycleTypes.ON_FORM_SUBMIT_END],
  reducer: (state: any, action: any) => {
    switch (action.type) {
      case LifeCycleTypes.ON_FORM_SUBMIT_START:
        return {
          ...state,
          submitting: true,
        };
      case LifeCycleTypes.ON_FORM_SUBMIT_END:
        return {
          ...state,
          submitting: false,
        };
      default:
        return state;
    }
  },
});

export const Cancel = ({
  showLoading,
  ...props
}: GlobalFormSchemaComponentType['cancelButton']) => (
  <FormSpy {...formSubmitLifeCycleFromFormSpy()}>
    {({ state, form }) => (
      <Button
        onClick={(e) => {
          form.reset({ validate: false });

          if (props.onClick) {
            e.preventDefault();
            e.persist();

            props.onClick(form as any);
          }
        }}
        disabled={showLoading ? state.submitting : undefined}
        {...props}
        loading={showLoading ? state.submitting : undefined}
      >
        {props.children || '取消'}
      </Button>
    )}
  </FormSpy>
);

createVirtualBox<React.PropsWithChildren<GlobalFormSchemaComponentType['cancelButton']>>(
  'cancelButton',
  Cancel,
);
