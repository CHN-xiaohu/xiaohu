import { SchemaForm } from '@/components/Business/Formily';
import { useRequest } from 'ahooks';
import { Spin, message } from 'antd';
import { createAsyncFormActions } from '@formily/antd';

import { getPayment, addPayment } from '../Api';

const formActions = createAsyncFormActions();

export const Pay = () => {
  const { loading } = useRequest(() =>
    Promise.all(['alipay', 'wxpay'].map((type) => getPayment(type))).then((res) => {
      const alipayLayout = res[0].data;
      const wxpay = res[1].data;

      const value = {
        alipayLayout,
        weChatLayout: {
          ...wxpay,
          remoteCertUrl: wxpay.privateCert ? 'https://show.p12' : '',
        },
      };

      formActions.setFormState((state) => {
        state.values = value;
      });

      return value;
    }),
  );

  const handleAddPayment = (values: any) => {
    const wechatPay = {
      platformFlag: 'app',
      remoteCertUrl: values.remoteCertUrl?.length === 16 ? '' : values.remoteCertUrl,
      ...values.weChatLayout,
      channelCode: 'wxpay',
      openWechatPay: undefined,
    };

    const aliPay = {
      platformFlag: 'app',
      ...values.alipayLayout,
      channelCode: 'alipay',
      openAlipay: undefined,
    };

    const updatePayments = [wechatPay, aliPay].filter((item) => !!item.appId);

    if (!updatePayments.length) {
      return Promise.resolve().then(() => message.success('保存成功！'));
    }

    return Promise.all(updatePayments.map((data) => addPayment(data))).then(() =>
      message.success('保存成功！'),
    );
  };

  return (
    <Spin spinning={loading}>
      <SchemaForm
        {...{
          labelCol: { span: 4 },
          wrapperCol: { span: 10 },
          onSubmit: handleAddPayment,
          actions: formActions,
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
                  type: 'number',
                  default: 0,
                  'x-component': 'switch',
                  'x-component-props': {
                    activeValue: 1,
                    inactiveValue: 0,
                  },
                  'x-linkages': [
                    {
                      type: 'value:display',
                      condition: '{{ !!$self.value }}',
                      target: 'weChatLayout.*(appId,mchId,privateKey,remoteCertUrl)',
                    },
                  ],
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
                  type: 'number',
                  default: 0,
                  'x-component': 'switch',
                  'x-component-props': {
                    activeValue: 1,
                    inactiveValue: 0,
                  },
                  'x-linkages': [
                    {
                      type: 'value:display',
                      condition: '{{ !!$self.value }}',
                      target: 'alipayLayout.*(appId,privateKey,publicKey)',
                    },
                  ],
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
              },
            },
          },
        }}
      />
    </Spin>
  );
};
