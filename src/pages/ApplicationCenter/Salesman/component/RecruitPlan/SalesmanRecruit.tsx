import { createFormActions } from '@formily/antd';

import { message } from 'antd';

import { NormalForm } from '@/components/Business/Formily';

import { saveOrUpdateSalesmanRules } from '../../Api';
import { useFields } from '../useFields';

const formActions = createFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  detail: {};
};

const SalesmanRecruit = ({ handleCreateAdSuccess, detail }: Props) => {
  const handleSubmit = (values: any) => {
    values.id = (detail as any)?.id;
    values.content.forEach((items: any, index: number) => {
      items.serial = index + 1;
      items.id = undefined;
    });
    values.type = 'RECRUIT_SALESMAN_RULE';
    saveOrUpdateSalesmanRules(values).then(() => {
      message.success('保存成功！');
      return handleCreateAdSuccess();
    });
  };

  return (
    <NormalForm
      {...{
        actions: formActions,
        onSubmit: handleSubmit,
        labelCol: { span: 3 },
        wrapperCol: { span: 6 },
        fields: { ...useFields() },
        initialValues: detail,
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '业务员招募页设置',
            },
            properties: {
              title: {
                title: '招募标题',
                type: 'string',
                'x-rules': {
                  required: true,
                },
                'x-component-props': {
                  placeholder: '业务员招募',
                },
              },
              content: {
                title: '招募内容',
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
            },
          },
        },
      }}
    />
  );
};

export default SalesmanRecruit;
