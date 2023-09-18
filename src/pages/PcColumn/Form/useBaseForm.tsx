import { TemplateSelectTree } from '@/pages/PcColumn/Constant';

type Props = {
  handleChangeColumn: (e: any) => void;
  handleChangeTemplateCode: (e: any) => void;
};

export const useBaseForm = ({ handleChangeColumn, handleChangeTemplateCode }: Props) => {
  const baseForm = {
    type: 'object',
    'x-component': 'card',
    'x-component-props': {
      title: '栏目信息',
      type: 'inner',
      className: 'product-category-container',
    },
    properties: {
      baseLayout: {
        type: 'object',
        'x-component': 'grid',
        'x-component-props': {
          gutter: 24,
          cols: [8, 8, 8],
        },
        properties: {
          name: {
            title: '栏目标题',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入栏目标题',
            },
            'x-rules': {
              required: true,
              range: [1, 10],
            },
          },
          type: {
            title: '栏目类型',
            type: 'string',
            enum: TemplateSelectTree.COLUMN_TYPE,
            'x-component-props': {
              onChange: (e: any) => handleChangeColumn(e),
              placeholder: '请选择',
            },
            'x-rules': {
              required: true,
              message: '栏目标题不能为空',
            },
            'x-linkages': [
              {
                type: 'value:display',
                condition: '{{ $self.value === "NAVIGATION_TEMPLATE" }}',
                target: 'addNavigationss',
              },
              {
                type: 'value:display',
                condition: '{{ $self.value === "ADVERT_TEMPLATE" }}',
                target: 'addAdv',
              },
              {
                type: 'value:display',
                condition: '{{ $self.value === "PRODUCT_TEMPLATE" }}',
                target: 'productTable',
              },
            ],
          },
          sort: {
            title: '位置排序',
            type: 'number',
            'x-props': {
              width: '100%',
              style: {
                width: '100%',
              },
            },
            'x-component-props': {
              min: 0,
              max: 999999,
              step: 1,
              placeholder: '请输入数字（0-99999）',
            },
            description: '由小到大排列显示，越小越靠前',
          },
        },
      },
      secondLayout: {
        type: 'object',
        'x-component': 'grid',
        'x-component-props': {
          gutter: 24,
          cols: [8, 8, 8],
        },
        properties: {
          templateCode: {
            title: '栏目模板',
            type: 'string',
            // enum: TemplateSelectTree.COLUMN_ADV,
            'x-component-props': {
              placeholder: '请选择',
              onChange: (e: any) => handleChangeTemplateCode(e),
            },
            'x-rules': {
              required: true,
              message: '栏目模板不能为空',
            },
            'x-linkages': [
              {
                type: 'value:display',
                // eslint-disable-next-line max-len
                condition:
                  '{{ $self.value === "PC_PRODUCT_TEMPLATE_TWO" || $self.value === "PC_PRODUCT_TEMPLATE_FOUR" }}',
                target: 'productAdvLayout',
              },
            ],
          },
          description: {
            title: '栏目描述',
            type: 'string',
            'x-component-props': {
              placeholder: '请输入栏目描述',
            },
            'x-rules': {
              range: [0, 20],
            },
          },
        },
      },
      thirdLayout: {
        type: 'object',
        'x-component': 'grid',
        properties: {
          templateImg: {
            type: 'templateImg',
          },
        },
      },
    },
  };

  return {
    baseForm,
  };
};
