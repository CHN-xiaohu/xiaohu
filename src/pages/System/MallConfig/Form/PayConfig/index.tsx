import { memo } from 'react';
import { useMount } from 'ahooks';
import { useImmer } from 'use-immer';

import { SchemaForm } from '@/components/Business/Formily';

import { getPayment, addPayment } from '../../Api';

export const PayConfig = memo(() => {
  /**
   * 存储表单数据
   * alipayLayout： 支付宝
   * wechat：微信
   */
  const [state, setState] = useImmer({
    alipayLayout: {},
    weChatLayout: {},
  });

  const handleGetPayDetail = () => {
    /**
     * 同时请求两个接口
     * wechat：微信支付
     * alipay：支付宝支付
     */
    Promise.all(['wxpay', 'alipay'].map((channelCode) => getPayment(channelCode))).then(
      (values) => {
        setState((draft) => {
          draft.weChatLayout = {
            ...values[0].data,
            remoteCertUrl: values[0].data.privateCert ? 'https://cert.p12' : '',
          };
          draft.alipayLayout = values[1].data;
        });
      },
    );
  };

  useMount(() => {
    handleGetPayDetail();
  });

  // 保存支付配置
  const handleSubmit = (values: any) => {
    const wechat = {
      channelCode: 'wxpay',
      platformFlag: 'pc_shopping_mall',
      appId: values.weChatLayout.appId,
      mchId: values.weChatLayout.mchId,
      privateKey: values.weChatLayout.privateKey,
      remoteCertUrl: values.weChatLayout.remoteCertUrl,
      status: values.weChatLayout.status ? 1 : 0,
    };

    const alipay = {
      channelCode: 'alipay',
      platformFlag: 'pc_shopping_mall',
      appId: values.alipayLayout.appId,
      privateKey: values.alipayLayout.privateKey,
      publicKey: values.alipayLayout.publicKey,
      status: values.alipayLayout.status ? 1 : 0,
    };

    const requestArr = [wechat, alipay].map((data, index) =>
      addPayment(data, { showSuccessMessage: index === 0 }),
    );

    return Promise.all(requestArr).then(() => {
      handleGetPayDetail();
    });
  };

  return (
    <SchemaForm
      {...{
        onSubmit: handleSubmit,
        initialValues: state,
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
        schema: {
          weChatLayout: {
            type: 'object',
            'x-component': 'realCardFormField',
            'x-component-props': {
              title: '微信商户号',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              status: {
                title: '开启微信支付',
                type: 'boolean',
                'x-props': {
                  checkedChildren: '开',
                  unCheckedChildren: '关',
                },
              },
              appId: {
                title: 'appId',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入appId',
                },
              },
              mchId: {
                title: 'mchId',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入mchId',
                },
              },
              privateKey: {
                title: '证书秘钥',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入证书秘钥',
                },
              },
              remoteCertUrl: {
                title: 'API证书',
                type: 'uploadFile',
                'x-component-props': {
                  accept: '.p12',
                  placeholder: '上传文件',
                },
                'x-rules': {
                  required: true,
                  message: '请上传p12后缀文件，且不超过500kb',
                },
              },
            },
          },
          alipayLayout: {
            type: 'object',
            'x-component': 'realCardFormField',
            'x-component-props': {
              title: '支付宝设置',
              type: 'inner',
              className: 'product-category-container',
            },
            properties: {
              status: {
                title: '开启支付宝支付',
                type: 'boolean',
                'x-props': {
                  checkedChildren: '开',
                  unCheckedChildren: '关',
                },
              },
              appId: {
                title: 'appId',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入appId',
                },
              },
              privateKey: {
                title: 'privateKey',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入privateKey',
                },
              },
              publicKey: {
                title: 'publicKey',
                type: 'string',
                'x-rules': {
                  required: true,
                  message: '请输入publicKey',
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
      }}
    />
  );
});
