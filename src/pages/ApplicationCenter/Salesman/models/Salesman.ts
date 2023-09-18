import { extendBaseModel } from '@/foundations/Model/Base/BaseModel';

const ModelDefinition = extendBaseModel({
  namespace: 'salesman' as 'salesman',
  state: {
    posterList: [
      {
        originnalImg: 'https://static.zazfix.com/web/images/2020-11-07/cp7j1JCf040phE10vQ0K.png',
        qrCodeHeight: 146.5,
        qrCodeWidth: 147.7,
        backgroundImageWidth: 720.0,
        backgroundImageHeight: 1280.0,
        qrCodeLeft: 286.0,
        qrCodeTop: 1032.0,
        style: 1,
        title: '风格一',
        isChecked: false,
        backgroundImg: '',
      },
      {
        originnalImg: 'https://static.zazfix.com/web/images/2020-11-07/543bPAern5ekv2gUa0wV.png',
        qrCodeHeight: 140.0,
        qrCodeWidth: 140.0,
        backgroundImageWidth: 720.0,
        backgroundImageHeight: 1280.0,
        qrCodeLeft: 81.0,
        qrCodeTop: 1070.0,
        style: 2,
        title: '风格二',
        isChecked: false,
        backgroundImg: '',
      },
      {
        originnalImg: 'https://static.zazfix.com/web/images/2020-11-07/qmCcAY0OU6YH7AkuZONh.png',
        qrCodeHeight: 171.0,
        qrCodeWidth: 171.0,
        backgroundImageWidth: 720.0,
        backgroundImageHeight: 1280.0,
        qrCodeLeft: 80.0,
        qrCodeTop: 1043.0,
        style: 3,
        title: '风格三',
        isChecked: false,
        backgroundImg: '',
      },
      {
        originnalImg: 'https://static.zazfix.com/web/images/2020-11-07/B4rlrRN1PWhb6sPckhYm.png',
        qrCodeHeight: 150.0,
        qrCodeWidth: 148.7,
        backgroundImageWidth: 720.0,
        backgroundImageHeight: 1280.0,
        qrCodeLeft: 292.0,
        qrCodeTop: 390.0,
        style: 4,
        title: '风格四',
        isChecked: false,
        backgroundImg: '',
      },
    ],
  },
  effects: {},

  subscriptions: {},
});

export default ModelDefinition;

declare global {
  interface PageModelState {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: typeof ModelDefinition.state;
  }

  interface PageModelReducers {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: GetAssignMethods<typeof ModelDefinition.reducers>;
  }

  interface PageModelEffects {
    // eslint-disable-next-line no-undef
    [ModelDefinition.namespace]: GetAssignMethods<typeof ModelDefinition.effects>;
  }
}
