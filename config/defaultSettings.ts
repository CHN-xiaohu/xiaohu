// import { Settings as ProSettings } from '@ant-design/pro-layout';

export default {
  title: '咋装云',
  name: 'aigo-manager',
  clientId: 'saber', // 客户端id
  clientSecret: 'saber_secret', // 客户端密钥
  tenantMode: true, // 开启租户模式
  flowDesignUrl: '',

  navTheme: 'dark' as const,
  primaryColor: '#1890FF',
  layout: 'side' as const,
  contentWidth: 'Fluid' as const,
  fixedHeader: false,
  autoHideHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  menu: {
    locale: true,
  },
  pwa: false,
  iconfontUrl: '',
};
