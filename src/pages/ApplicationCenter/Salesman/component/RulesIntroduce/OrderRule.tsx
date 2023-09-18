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

const OrderRule = ({ handleCreateAdSuccess, detail }: Props) => {
  const handleOrderSubmit = (values: any) => {
    values.content.forEach((items: any, index: number) => {
      items.serial = index + 1;
      items.id = undefined;
    });
    values.id = (detail as any)?.id;
    values.type = 'ORDER_SALESMAN_RULE';
    saveOrUpdateSalesmanRules(values).then(() => {
      message.success('保存成功！');
      return handleCreateAdSuccess();
    });
  };

  return (
    <NormalForm
      {...{
        actions: formActions,
        onSubmit: handleOrderSubmit,
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
              title: '订单规则说明',
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

export default OrderRule;
