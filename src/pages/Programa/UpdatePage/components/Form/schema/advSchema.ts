import { TemplateSelectTree } from '@/pages/Programa/Constant';

import type { IMarkupSchemaFieldProps } from '@formily/antd';

export const advSchema: Record<string, IMarkupSchemaFieldProps> = {
  LAYOUT_1: {
    type: 'layout',
    'x-component-props': {
      inline: 'true',
    },
    properties: {
      picUrl: {
        type: 'uploadFile',
        title: '图片',
        required: true,
        default: undefined,
        'x-component-props': {
          rule: {},
        },
      },
      actionType: {
        type: 'string',
        title: '广告跳转',
        enum: TemplateSelectTree.ACTION_TYPE,
        required: true,
        'x-component-props': {
          placeholder: '请选择',
        },
        'x-props': {
          style: {
            maxWidth: '150px',
            minWidth: '150px',
          },
        },
      },
      actionValue: {
        type: 'treeWithString',
        required: true,
        editable: false,
        'x-component-props': {
          placeholder: '请输入',
        },
        'x-props': {
          style: {
            maxWidth: '180px',
            minWidth: '180px',
          },
        },
      },
    },
  },
};

export default advSchema;
