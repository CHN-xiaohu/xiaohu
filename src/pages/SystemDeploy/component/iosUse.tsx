export const IosUse = {
  bundleId: {
    title: 'bundleId',
    type: 'string',
    'x-rules': {
      required: true,
      message: 'bundleId',
    },
  },
  iosStartPictureOne: {
    title: '启动图1920',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '1080*1920',
      maxSize: 0.5,
      rule: {
        maxImageWidth: 1080,
        maxImageHeight: 1920,
      },
    },
    description: '只能上传jpg/png文件，尺寸1080*1920',
    'x-rules': {
      required: true,
      message: '请上传启动图1920',
    },
  },
  iosStartPictureTwo: {
    title: '启动图2340',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '1080*2340',
      maxSize: 0.5,
      rule: {
        maxImageWidth: 1080,
        maxImageHeight: 2340,
      },
    },
    description: '只能上传jpg/png文件，尺寸1080*2340',
    'x-rules': {
      required: true,
      message: '请上传启动图2340',
    },
  },
  iosWelcomePictureOne: {
    title: '欢迎页图1920',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '1080*1920',
      maxSize: 0.5,
      rule: {
        maxImageWidth: 1080,
        maxImageHeight: 1920,
      },
    },
    description: '只能上传jpg/png文件，尺寸1080*1920',
    'x-rules': {
      required: true,
      message: '请上传欢迎页图1920',
    },
  },
  iosWelcomePictureTwo: {
    title: '欢迎页图2340',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '1080*2340',
      maxSize: 0.5,
      rule: {
        maxImageWidth: 1080,
        maxImageHeight: 2340,
      },
    },
    description: '只能上传jpg/png文件，尺寸1080*2340',
    'x-rules': {
      required: true,
      message: '请上传欢迎页图2340',
    },
  },
  iosCert: {
    title: '开发cert',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '上传.cert文件',
      accept: '.cert',
    },
    description: '只能上传cert后缀文件',
    'x-rules': {
      required: true,
      message: '请上传开发cert文件',
    },
  },
  iosPush: {
    title: '推送证书push',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '上传.push文件',
      accept: '.push,.p12',
    },
    description: '只能上传push后缀文件',
    'x-rules': {
      required: true,
      message: '请上传开发push文件',
    },
  },
  iosProfile: {
    title: '签名文件profile',
    'x-component': 'uploadFile',
    'x-component-props': {
      placeholder: '上传.profile文件',
      accept: '.profile',
    },
    description: '只能上传profile后缀文件',
    'x-rules': {
      required: true,
      message: '请上传开发profile文件',
    },
  },
  iosDownloadAddress: {
    title: '苹果应用市场地址',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入苹果应用市场地址',
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
