import type { NormalFormProps } from '@/components/Business/Formily';
import { SchemaForm } from '@/components/Business/Formily';

import { createFormActions } from '@formily/antd';

import { useFields } from '../../component/useFields';

const Details = ({ initialValues }: any) => {
  const formActions = createFormActions();

  const props: NormalFormProps = {
    actions: formActions,
    labelCol: 5,
    wrapperCol: 16,
    initialValues,
    editable: false,
    fields: { ...useFields() },
    schema: {
      formLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          size: 'default',
        },
        properties: {
          basicLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '业务员信息',
              type: 'inner',
            },
            properties: {
              items1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8, 8],
                },
                properties: {
                  salesmanName: {
                    title: '名称',
                    type: 'string',
                  },
                  registerPhone: {
                    title: '注册手机',
                    type: 'string',
                  },
                  linkPhone: {
                    title: '联系手机号',
                    type: 'string',
                  },
                },
              },
              items2: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8],
                },
                properties: {
                  invitationSalesmanName: {
                    title: '邀请者',
                    type: 'string',
                  },
                  places: {
                    title: '所在地区',
                    type: 'string',
                  },
                },
              },
              items3: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8],
                },
                properties: {
                  serviceArea: {
                    title: '服务地区',
                    type: 'string',
                  },
                  businessType: {
                    title: '业务模式',
                    type: 'string',
                    display: false,
                    'x-linkages': [
                      {
                        type: 'value:display',
                        condition: '{{ $self.value === 1 }}',
                        target: 'serviceArea',
                      },
                    ],
                  },
                },
              },
            },
          },
          acheieveLayout: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '业绩统计',
              type: 'inner',
            },
            properties: {
              countNum: {
                title: '',
                type: 'achievementBox',
              },
            },
          },
        },
      },
    },
  };

  return (
    <>
      <SchemaForm {...props} />
    </>
  );
};

export default Details;
