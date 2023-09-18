export const AndroidUse = {
  packageName: {
    title: '包名',
    type: 'string',
    'x-rules': {
      required: true,
      message: '请输入包名',
    },
  },
  androidStartPictureOne: {
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
  androidStartPictureTwo: {
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
  androidWelcomePictureOne: {
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
  androidWelcomePictureTwo: {
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
