import { memo, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { history } from 'umi';
import { createAsyncFormActions } from '@formily/antd';

import { SchemaForm, createLinkageUtils } from '@/components/Business/Formily';

import { getKujialeSetting, saveKujileSetting } from '../../Api';

import './index.less';

type IProps = {
  count: number;
  cancel: () => void;
};

const formActions = createAsyncFormActions();

export const KujialeConfig = memo(({ count, cancel }: IProps) => {
  const [initialValues, setInitialValues] = useState({} as any);
  const { tenantCode, tenantName } = history.location?.query;

  useEffect(() => {
    getKujialeSetting({ tenantCode }).then((res) => {
      setInitialValues(res.data);
    });
  }, [count]);

  const handleSubmit = () => {
    formActions.validate().then(() => {
      formActions.getFormState().then((formState) => {
        const { values } = formState;
        values.tenantCode = tenantCode;
        values.id = initialValues?.id;
        saveKujileSetting(values).then((res) => {
          message.info(res.msg);
          cancel();
        });
      });
    });
  };

  setTimeout(() => {
    formActions.setFieldValue('isOpen', initialValues.isOpen || 0);
    formActions.setFieldValue('tenantName', initialValues.tenantName || tenantName);
    formActions.setFieldState('userType', (state: any) => {
      state.props['x-component-props'].disabled = initialValues?.userType === 0;
    });
    formActions.setFieldValue('userType', initialValues.userType);
  }, 300);

  return (
    <>
      <SchemaForm
        {...{
          actions: formActions,
          initialValues,
          labelCol: { span: 4 },
          wrapperCol: { span: 18 },
          effects: ($) => {
            const linkage = createLinkageUtils();
            $('onFieldValueChange', 'userType').subscribe((userTypeState) => {
              console.log('userTypeState', userTypeState);
              linkage.visible('*(password,subAccountNum)', !userTypeState.value);
            });
          },
          schema: {
            isOpen: {
              title: '酷家乐服务',
              type: 'radio',
              default: 0,
              enum: [
                { label: '开启', value: 1 },
                { label: '关闭', value: 0 },
              ],
            },
            tenantName: {
              title: '商家用户名',
              type: 'string',
              'x-component-props': {
                maxLength: 30,
              },
              'x-rules': [
                {
                  required: true,
                  message: '请输入商城名称',
                },
              ],
            },
            userType: {
              title: '用户类型',
              type: 'radio',
              'x-component-props': {
                default: 1,
                disabled: false,
              },
              enum: [
                { label: '商家子账户', value: 0 },
                { label: '非商家子账户', value: 1 },
              ],
            },
            subAccountNum: {
              title: '创建子账号个数',
              type: 'number',
              'x-component-props': {
                default: 0,
                min: 0,
                max: 999,
                step: 1,
                precision: 0,
              },
              'x-props': {
                style: {
                  width: '100%',
                },
              },
            },
            password: {
              title: '默认密码',
              type: 'string',
              description: '用于登录酷家乐后台的密码',
            },
          },
        }}
      />
      <div className="content-footer">
        <Button type="primary" className="save-btn" onClick={handleSubmit}>
          保存
        </Button>
        <Button onClick={cancel}>取消</Button>
      </div>
    </>
  );
});
