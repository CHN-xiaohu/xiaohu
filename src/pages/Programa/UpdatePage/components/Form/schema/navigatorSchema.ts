import { TemplateSelectTree } from '@/pages/Programa/Constant';

import type { IMarkupSchemaFieldProps } from '@formily/antd';

export const navigatorSchema: Record<string, IMarkupSchemaFieldProps> = {
  GRID_BLOCK: {
    'x-component': 'grid',
    'x-props': {
      cols: [8, 8, 5],
    },
    properties: {
      picUrl: {
        type: 'uploadFile',
        title: '图片',
        required: true,
        'x-props': {
          placeholder: '100 * 100',
          rule: {
            maxImageWidth: 100,
            maxImageHeight: 100,
          },
        },
      },
      actionType: {
        type: 'string',
        title: '跳转地址',
        required: true,
        enum: TemplateSelectTree.ACTION_TYPE,
        'x-props': {
          placeholder: '请选择',
        },
      },
      actionValue: {
        type: 'treeWithString',
        required: true,
        editable: false,
        'x-props': {
          placeholder: '请输入',
        },
      },
    },
  },
  GRID_BLOCK_1: {
    'x-component': 'grid',
    'x-props': {
      cols: [8, 8, 5],
    },
    properties: {
      title: {
        type: 'string',
        title: '标题',
        required: true,
        'x-rules': [
          {
            validator: (value) => (value.length <= 5 ? null : '最多只能输入5个字'),
          },
        ],
        'x-props': {
          placeholder: '请输入导航标题',
        },
      },
      label: {
        type: 'string',
        title: '标签',
        // required: true,
        'x-rules': [
          {
            validator: (value) => (value.length <= 5 ? null : '最多只能输入5个字'),
          },
        ],
        'x-props': {
          placeholder: '请输入new、hot等标签，非必填',
        },
      },
    },
  },
};
