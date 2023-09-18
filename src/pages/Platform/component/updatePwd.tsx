// import { useCallback } from 'react';
// import { Typography } from 'antd';
import { createAsyncFormActions } from '@formily/antd';
import { useStepModalForm } from '@/components/Business/Formily/components/Forms/StepModalForm';

// import {
//   bizGroupPurchaseConditionsSchema,
//   bizGroupPurchaseConditionsFieldPath,
//   useBizGroupPurchaseConditionsEffects,
// } from './BizGroupPurchaseConditionsField';

export const formActions = createAsyncFormActions();

export const useUpdatePwd = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { openForm, FormElement } = useStepModalForm({
    // fields,
    actions: formActions,
    schema: {
      infoLayout: {
        type: 'virtualBox',
        properties: {
          contactNumber: {
            type: 'string',
            title: '手机号',
            description: '若该手机号已无法使用请联系客服',
          },
          code: {
            type: 'string',
            title: '验证码',
            'x-component-props': {
              placeholder: '短信验证码',
            },
          },
        },
      },
      productLayout: {
        type: 'virtualBox',
        properties: {
          newPassword: {
            type: 'string',
            title: '操作密码',
            'x-component-props': {
              placeholder: '输入新的操作密码',
            },
            'x-rules': {
              required: true,
              message: '请输入操作密码',
            },
          },
          checkPassword: {
            type: 'string',
            title: '确认密码',
            'x-component-props': {
              placeholder: '输入新的操作密码',
            },
            'x-rules': {
              required: true,
              message: '请输入操作密码',
            },
          },
        },
      },
    },
  });
};
