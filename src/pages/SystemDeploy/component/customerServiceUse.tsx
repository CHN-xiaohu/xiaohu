export const CustomerServiceUse = {
  consumerLayout: {
    type: 'object',
    'x-component': 'card',
    'x-component-props': {
      size: 'default',
    },
    properties: {
      appLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: 'app端客服设置',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          customerServiceCall: {
            title: '客服电话',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入客服电话',
            },
          },
          customerServiceWechat: {
            title: '客服微信号',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入客服微信号',
            },
          },
        },
      },
      formButtonList: {
        type: 'object',
        'x-component': 'formButtonGroup',
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
  },
};
