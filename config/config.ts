import { defineConfig } from 'umi';
// import defaultSettings from './defaultSettings';
import chainWebpack, { resolve } from './chainWebpack';

import routes from './route.config';

// const { theme } = defaultSettings;

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  routes,

  // 开启 react-refresh
  fastRefresh: {},

  // 使用 esbuild 作为压缩器
  esbuild: {},

  // mfsu: {},
  webpack5: {},

  dynamicImport: {
    loading: '@/components/Loading',
  },

  // webpack5: {
  //   // lazyCompilation: {
  //   //   entries: true,
  //   //   // 动态加载延迟加载
  //   //   imports: true,
  //   //   // test： xxxx
  //   // },
  // },

  // cssModulesTypescriptLoader: {
  //   mode: 'emit',
  // },

  nodeModulesTransform: {
    type: isDev ? 'none' : 'all',
    exclude: isDev
      ? [
          '@formily/antd',
          '@formily/antd-components',
        ]
      : undefined,
  },

  publicPath: `${process.env.APP_PUBLIC_PATH || ''}/`,

  targets: { chrome: 46, firefox: 45, safari: 10, edge: 13, ios: 10, ie: 11 },

  devtool: false,

  chunks: ['vendors', 'vendor-commons', 'umi', 'commons'],

  externals: isDev
    ? { moment: 'window.moment' }
    : {
        // 利用 externals 将 antd 从剔除，因为已经用 dayjs 替换了 moment
        moment: 'window.moment',
        react: 'window.React',
        'react-dom': 'window.ReactDOM',
      },

  // todo: 复用不变的 vendors、vendor-commons、umi 等 chunk 来命中缓存，优化加载性能
  scripts: isDev
    ? []
    : [
        'https://static.zazfix.com/package/react@17.0.1/umd/react.production.min.js',
        'https://static.zazfix.com/package/react-dom@17.0.1/umd/react-dom.production.min.js',
      ],

  // favicon: '',

  antd: {},

  dva: {
    hmr: true,
    immer: true,
    skipModelValidate: true,
  },

  extraBabelPlugins: ['lodash'],

  locale: {
    default: 'zh-CN',
    antd: true,
    title: true,
    baseNavigator: true,
    baseSeparator: '-',
  },

  // 暂时关闭, umi3 暂时还没支持
  pwa: false,

  hash: true,

  define: {
    'process.env.APP_NODE_ENV': process.env.APP_NODE_ENV,
    'process.env.APP_BASE_URL': process.env.APP_BASE_URL,
  },

  manifest: {
    basePath: '/',
  },

  alias: {
    '@app': resolve(''),
    '@app_utils': resolve('utils'),
    '@app_services': resolve('services'),
    '@app_pages': resolve('pages'),
    '@app_models': resolve('models'),
    '@app_assets': resolve('assets'),
    '@app_layouts': resolve('layouts'),
    '@app_components': resolve('components'),
    '@app_business': resolve('components/Business'),
  },

  lessLoader: {
    javascriptEnabled: true,
  },

  ignoreMomentLocale: true,

  chainWebpack,

  /**
   * antd 的主题自定义
   *
   * @see https://umijs.org/zh/config/#theme
   * @see https://ant.design/docs/react/customize-theme-cn
   */
  // theme,
});
