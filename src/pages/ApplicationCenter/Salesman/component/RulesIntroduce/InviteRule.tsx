import { createFormActions } from '@formily/antd';

import { NormalForm } from '@/components/Business/Formily';
import { message } from 'antd';

import { saveOrUpdateSalesmanRules } from '../../Api';

import { useFields } from '../useFields';

const formActions = createFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  detail: {};
};

const InviteRule = ({ handleCreateAdSuccess, detail }: Props) => {
  const handleInviteSubmit = (values: any) => {
    values.content.forEach((items: any, index: number) => {
      items.serial = index + 1;
      items.id = undefined;
    });
    values.type = 'INVITATION_SALESMAN_RULE';
    values.id = (detail as any)?.id;
    saveOrUpdateSalesmanRules(values).then(() => {
      message.success('保存成功！');
      return handleCreateAdSuccess();
    });
  };

  return (
    <NormalForm
      {...{
        actions: formActions,
        onSubmit: handleInviteSubmit,
        initialValues: detail,
        labelCol: { span: 3 },
        wrapperCol: { span: 6 },
        fields: { ...useFields() },
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '邀请好友规则',
            },
            properties: {
              title: {
                title: '规则标题',
                type: 'string',
                'x-component-props': {
                  placeholder: '规则说明',
                },
                'x-rules': {
                  required: true,
                },
              },
              content: {
                title: '规则内容',
                type: 'detailEditor',
                'x-rules': {
                  required: true,
                },
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

export default InviteRule;
