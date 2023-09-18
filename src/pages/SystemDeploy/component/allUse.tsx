export const AllUsed = {
  formLayout: {
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
          title: '通用配置',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          appName: {
            title: 'APP名称',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入app名称',
              },
            ],
          },
          slogan: {
            title: '标语/slogan',
            type: 'string',
            'x-rules': [
              {
                required: true,
                message: '请输入标语/slogan',
              },
            ],
          },
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
          appIcon: {
            title: '应用图标',
            'x-component': 'uploadFile',
            'x-component-props': {
              placeholder: '1024*1024',
              maxSize: 0.5,
              accept: '.png,.jpg,jpeg',
              rule: {
                maxImageWidth: 1024,
                maxImageHeight: 1024,
              },
            },
            description: '只能上传png文件，尺寸1024*1024',
            'x-rules': {
              required: true,
              message: '请上传应用图标',
            },
          },
        },
      },
      auroraLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '极光推送',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          openPush: {
            title: '开启推送',
            type: 'boolean',
            'x-props': {
              checkedChildren: '开',
              unCheckedChildren: '关',
            },
          },
          appKey: {
            title: 'appKey',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入appKey',
            },
          },
          masterSecret: {
            title: 'masterSecret',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入masterSecret',
            },
          },
          apnsProduction: {
            title: 'apnsProduction',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入apnsProduction',
            },
          },
        },
      },
      mapLayout: {
        type: 'object',
        'x-component': 'card',
        'x-component-props': {
          title: '高德地图',
          type: 'inner',
          className: 'product-category-container',
        },
        properties: {
          gouldMapAndroidKey: {
            title: '安卓端key',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入安卓端key',
            },
          },
          gouldMapIosKey: {
            title: 'IOS端key',
            type: 'string',
            'x-rules': {
              required: true,
              message: '请输入IOS端key',
            },
          },
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
    },
  },
};
