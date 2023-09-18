export const AllUsed = {
  mainColor: {
    title: '主色',
    type: 'chooseColor',
    'x-component-props': {
      placeholder: '请选择或输入主色',
    },
    'x-rules': {
      required: true,
      message: '请选择主色',
    },
  },
  auxiliaryColor: {
    title: '辅助色',
    type: 'chooseColor',
    'x-component-props': {
      placeholder: '请选择或输入辅助色',
    },
    'x-rules': {
      required: true,
      message: '请选择辅助色',
    },
  },
  originalId: {
    title: '小程序原始ID',
    type: 'string',
    'x-rules': {
      // required: true,
      message: '请输入小程序原始ID',
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
};
