export const PayUse = {
  miniAppId: {
    title: 'appId',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入appId',
    },
  },
  appSecrete: {
    title: 'appSecrete',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入appSecrete',
    },
  },
  mchId: {
    title: 'mchId',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入mchId',
    },
  },
  partnerKey: {
    title: 'partnerKey',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入partnerKey',
    },
  },
  remoteCertUrl: {
    title: 'certPath证书',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '上传p12文件',
      accept: '.p12',
    },
    description: '只能上传p12后缀文件',
    'x-rules': {
      required: true,
      message: '请上传开发p12文件',
    },
  },

  formButtonList: {
    type: 'object',
    'x-component': 'formButtonGroup',
    'x-component-props': {
      sticky: true,
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
};
