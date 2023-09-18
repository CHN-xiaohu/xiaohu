import { createFormActions } from '@formily/antd';

import { NormalForm } from '@/components/Business/Formily';
import { message } from 'antd';

import { useFields } from '../useFields';

import { saveOrUpdateSalesmanRules } from '../../Api';

const formActions = createFormActions();

type Props = {
  handleCreateAdSuccess: () => void;
  detail: {};
};

const SalesmanRule = ({ handleCreateAdSuccess, detail }: Props) => {
  const handleRulesSubmit = (values: any) => {
    values.content.forEach((items: any, index: number) => {
      items.serial = index + 1;
      items.id = undefined;
    });
    values.type = 'SALESMAN_RULE';
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
        onSubmit: handleRulesSubmit,
        initialValues: detail,
        fields: { ...useFields() },
        labelCol: { span: 3 },
        wrapperCol: { span: 6 },
        schema: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              type: 'inner',
              title: '业务员规则说明',
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

export default SalesmanRule;
