import { SchemaForm } from '@/components/Business/Formily';
import { memo } from 'react';
import { Alert, Card } from 'antd';
import { useRequest } from 'ahooks';

import { getOfficialAccount, saveOrUpdateOfficialAccount } from '../Api';

export const Configure = memo(() => {
  // 获取公众号配置
  const { data: initialValues } = useRequest(getOfficialAccount, {
    formatResult: (res) => res.data,
  });

  return (
    <Card>
      <div style={{ marginBottom: 40 }}>
        <Alert
          showIcon
          message={'公众号和小程序结合使用的条件：'}
          description={
            <>
              <div>1.需公众号和小程序主体一致</div>
              <div>2.需前往小程序后台，在“设置”→“关注公众号”中设置要展示的公众号</div>
            </>
          }
          type="info"
        />
      </div>

      <SchemaForm
        {...{
          initialValues,
          labelCol: { span: 3 },
          wrapperCol: { span: 6 },
          onSubmit: saveOrUpdateOfficialAccount,
        }}
        schema={{
          appId: {
            title: '公众号appid',
            type: 'string',
            'x-component': 'input',
            'x-component-props': {
              showLengthCount: true,
              maxLength: 8,
            },
            'x-rules': [
              {
                required: true,
                message: '请输入公众号appid',
              },
            ],
          },
          appSecret: {
            title: '公众号密钥',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入公众号密钥',
            },
            'x-rules': {
              required: true,
              message: '请填写公众号密钥',
            },
          },
          qrCodeUrl: {
            title: '公众号二维码',
            description: '最佳尺寸344*344，前往公众号后台/公众号设置，点击下载12cm二维码',
            'x-component': 'uploadFile',
            'x-component-props': {
              maxSize: 0.5,
              accept: '.png,.jpg,jpeg',
              placeholder: '344*344',
            },
            'x-rules': {
              required: true,
              message: '请上传应用图标',
            },
          },
          formButtonList: {
            type: 'object',
            'x-component': 'formButtonGroup',
            properties: {
              cancelButton: {
                type: 'cancelButton',
                'x-component-props': {
                  children: '重置',
                  style: {
                    marginTop: '4px',
                  },
                },
              },
              buttonGroup: {
                type: 'submitButton',
                'x-component-props': {
                  sticky: true,
                  children: '保存',
                },
              },
            },
          },
        }}
      />
    </Card>
  );
});
