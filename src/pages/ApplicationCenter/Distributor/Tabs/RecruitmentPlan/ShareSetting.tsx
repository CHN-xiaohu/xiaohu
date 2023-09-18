import { SchemaForm } from '@/components/Business/Formily';
import { createAsyncFormActions } from '@formily/antd';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';

import { getDistributorExtension, saveOrUpdateDistributorExtension } from '../../api';

const formActions = createAsyncFormActions();

const description = (
  <span>
    <p>最佳尺寸：800*640，小于 1M</p>
  </span>
);

export const ShareSetting = () => {
  const { loading } = useRequest(getDistributorExtension, {
    formatResult: (res) => {
      formActions.setFormState((state) => {
        state.values = res.data;
      });
    },
  });

  return (
    <Spin spinning={loading}>
      <SchemaForm
        labelCol={{ span: 5 }}
        actions={formActions}
        onSubmit={saveOrUpdateDistributorExtension}
        schema={{
          id: {
            type: 'string',
            display: false,
          },
          layout: {
            type: 'layout',
            'x-props': {
              style: {
                width: 550,
                padding: 24,
              },
            },
            properties: {
              shareTitle: {
                type: 'string',
                title: '分享标题',
                'x-component': 'input',
                'x-component-props': {
                  showLengthCount: true,
                  maxLength: 10,
                },
                'x-rules': [{ required: true, message: '请输入分享标题' }],
              },
              shareContent: {
                type: 'string',
                title: '分享内容',
                'x-component': 'input',
                'x-component-props': {
                  showLengthCount: true,
                  maxLength: 25,
                },
                'x-rules': [{ required: true, message: '请输入分享内容' }],
              },
              icon: {
                type: 'uploadFile',
                title: '分享图标',
                description,
                default: 'https://static.zazfix.com/web/images/2020-12-02/8rBB4bm6vXI618fcZvjK.png',
                'x-component-props': {
                  maxSize: 1,
                },
                'x-rules': [{ required: true, message: description }],
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
        }}
      />
    </Spin>
  );
};
