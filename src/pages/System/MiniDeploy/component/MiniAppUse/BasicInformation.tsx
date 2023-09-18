import { SchemaForm } from '@/components/Business/Formily';

import { memo } from 'react';
import { createFormActions } from '@formily/antd';

import { Button, Card, Empty } from 'antd';

import { authorizeNow } from './ProfileInformation/OverviewOperation';

const TypeAuthentication = {
  '-1': '未认证',
  '0': '已认证',
};

const formActions = createFormActions();

const EmptyPrompt = ({ value }: { value: any }) =>
  value ? <span>{value}</span> : <span style={{ color: 'red' }}>请前往微信小程序后台进行设置</span>;

export const BasicInformation = memo(({ result, refresh }: { result: any; refresh: any }) => {
  const dataSource = result?.data;
  const isItAuthorized = result?.success ?? false;

  return !isItAuthorized ? (
    <Card>
      <Empty
        image={'https://static.zazfix.com/web/images/2021-03-13/W19jjDIN4Sl7CH9B5L6n.png'}
        description={<span>小程序授权后可查看</span>}
      >
        <Button onClick={() => authorizeNow(refresh)} type="primary">
          前往授权
        </Button>
      </Empty>
    </Card>
  ) : (
    <SchemaForm
      {...{
        colon: false,
        editable: false,
        actions: formActions,
        className: 'formUnderline',
        labelCol: { span: 3 },
        components: { EmptyPrompt },
        wrapperCol: { span: 12, offset: 1 },
        initialValues: {
          ...dataSource,
          verifyTypeInfo: TypeAuthentication[dataSource.verifyTypeInfo],
        },
        schema: {
          basicInformationLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '基础信息',
              type: 'inner',
            },
            properties: {
              nickName: {
                type: 'string',
                title: '小程序名称',
                'x-component': 'EmptyPrompt',
                'x-props': {
                  itemClassName: 'asterisk',
                },
                'x-rules': {
                  required: true,
                  message: '请输入小程序名称',
                },
              },
              headImg: {
                type: 'string',
                title: '小程序LOGO',
                'x-component': 'uploadFile',
                'x-rules': {
                  required: true,
                  message: '请上传Logo',
                },
                'x-component-props': {
                  placeholder: '50*50',
                },
                'x-props': {
                  itemClassName: 'asterisk',
                  rule: {
                    maxImageWidth: 50,
                    maxImageHeight: 50,
                  },
                },
              },
              category: {
                type: 'string',
                title: '服务类目',
                'x-component': 'EmptyPrompt',
                'x-rules': {
                  required: true,
                  message: '请输入服务类目',
                },
                'x-props': {
                  itemClassName: 'asterisk',
                },
              },
              signature: {
                type: 'string',
                title: '介绍',
                'x-component': 'EmptyPrompt',
                'x-rules': {
                  required: true,
                  message: '请输入介绍',
                },
                'x-props': {
                  itemClassName: 'asterisk',
                },
              },
              principalName: {
                type: 'string',
                title: '主体信息',
              },
              verifyTypeInfo: {
                type: 'string',
                title: '微信认证',
              },
            },
          },
          accountInformationLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '账号信息',
              type: 'inner',
            },
            properties: {
              authorizerAppid: {
                type: 'string',
                title: '小程序ID',
              },
              userName: {
                type: 'string',
                title: '原始ID',
              },
              appId: {
                type: 'string',
                title: '开放平台账号ID',
              },
            },
          },
        },
      }}
    />
  );
});
