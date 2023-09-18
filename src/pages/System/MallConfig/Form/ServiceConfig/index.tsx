import { memo, useState } from 'react';
import { useMount } from 'ahooks';
import { message } from 'antd';

import { SchemaForm } from '@/components/Business/Formily';

import { getConsumerService, addConsumerService } from '../../Api';

export const ServiceConfig = memo(() => {
  // 存储表单初始值
  const [initialValues, setInitialValues] = useState({});

  useMount(() => {
    // 获取客服配置
    getConsumerService().then((res) => {
      setInitialValues(res.data);
    });
  });

  const handleSubmit = (value: AnyObject) => {
    addConsumerService(value).then(() => {
      message.success('设置成功！');
    });
  };

  return (
    <SchemaForm
      {...{
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
        onSubmit: handleSubmit,
        initialValues,
        schema: {
          consumerLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              size: 'default',
            },
            properties: {
              appLayout: {
                type: 'object',
                'x-component': 'card',
                'x-component-props': {
                  title: 'PC商城客服设置',
                  type: 'inner',
                  className: 'product-category-container',
                },
                properties: {
                  customerServiceCall: {
                    title: '客服电话',
                    type: 'string',
                    'x-rules': {
                      required: true,
                      message: '请输入客服电话',
                    },
                  },
                  customerServiceWechat: {
                    title: '客服微信号',
                    type: 'string',
                    'x-rules': {
                      required: true,
                      message: '请输入客服微信号',
                    },
                  },
                },
              },
              formButtonList: {
                type: 'object',
                'x-component': 'formButtonGroup',
                properties: {
                  buttonGroup: {
                    type: 'submitButton',
                    'x-component-props': {
                      children: '保存',
                    },
                  },
                  cancelButton: {
                    type: 'cancelButton',
                    'x-component-props': {
                      children: '重置',
                      style: {
                        marginTop: '4px',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }}
    />
  );
});
