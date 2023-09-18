import { createFormActions } from '@formily/antd';

import { NormalForm } from '@/components/Business/Formily';

import { saveOrUpdateSalesmanExtension } from '../../Api';

const formActions = createFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  detail: {};
};

const RecruitShare = ({ handleCreateAdSuccess, detail }: Props) => {
  const handleShareSubmit = (value: any) =>
    saveOrUpdateSalesmanExtension(value).then(handleCreateAdSuccess);

  return (
    <NormalForm
      {...{
        actions: formActions,
        onSubmit: handleShareSubmit,
        labelCol: { span: 3 },
        wrapperCol: { span: 6 },
        initialValues: detail,
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '招募分享设置',
            },
            properties: {
              shareTitle: {
                title: '分享标题',
                type: 'string',
                'x-rules': {
                  required: true,
                },
                'x-component-props': {
                  placeholder: '招募经销商啦！',
                },
              },
              shareContent: {
                title: '分享内容',
                type: 'string',
                'x-component-props': {
                  placeholder: '海量低价、优质商品，等你来发现！',
                },
                'x-rules': {
                  required: true,
                },
              },
              icon: {
                title: '分享图标',
                type: 'uploadFile',
              },
            },
          },
          formButtonList: {
            type: 'object',
            'x-component': 'formButtonGroup',
            'x-component-props': {
              sticky: false,
            },
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
};

export default RecruitShare;
