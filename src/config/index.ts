const oss = {
  //
};

const cos = {
  domain: 'http://193.112.84.134/deploy',
  cdnDomain: 'https://zwx-static-1300039051.cos.ap-guangzhou.myqcloud.com',
  bucket: 'zwx-static-1300039051',
  region: 'ap-guangzhou',
  uploadPrefix: 'web/',
  secretMaps: {
    development:
      'Kv3uk7$2y$10$KsO$2y$10$jXbZdarElieZbdUyyN3jnTfNQcKv3uk7FWDwQKoxpmy$10$KsOnU0wKbfM2',
  },
};

const qiniu = {
  // domain: 'http://193.112.84.134/deploy',
  domain: '/zwx-resource/oss/grantToken',
  cdnDomain: 'https://static.zazfix.com',
  uploadPrefix: 'web/',
  // secretMaps: {
  //   development: 'Kv3uk7$2y$10$KsO$2y$10$jXbZdarElieZbdUyyN3jnTfNQcKv3uk7FWDwQKoxpmy$10$KsOnU0wKbfM2',
  // },
};

// 开发
const development = {
  apiUrl: 'https://api-dev.zazfix.com',
  iconfontScriptUrl: '//at.alicdn.com/t/font_1698753_joec0xihx3l.js',
  designPreviewUrl: 'https://h5-pages.devs.zazfix.com/preview',
  oss,
  cos,
  qiniu,
  client_id: 'qjaL9WaK0gUP8K1r',
};

// 预生产
const preProduction: typeof development = {
  apiUrl: 'https://api-dev.zazfix.com',
  iconfontScriptUrl: '//at.alicdn.com/t/font_1698753_joec0xihx3l.js',
  designPreviewUrl: 'https://h5-pages.devs.zazfix.com/preview',
  oss,
  cos,
  qiniu,
  client_id: 'qjaL9WaK0gUP8K1r',
};

// 生产
const production: typeof development = {
  apiUrl: 'https://server.zazfix.com',
  iconfontScriptUrl: '//at.alicdn.com/t/font_1698753_joec0xihx3l.js',
  designPreviewUrl: 'https://h5-pages.zazfix.com/preview',
  oss,
  cos,
  qiniu,
  client_id: 'ODg4fKZm5U7NkMbI',
};

const defaultAppConfig = {
  development,
  preProduction,
  production,
  devProduction: production,
}[process.env.APP_NODE_ENV || 'production'];

export const AppConfig = {
  ...(defaultAppConfig as typeof development),
  APP_NODE_ENV: process.env.APP_NODE_ENV as 'production' | 'development' | 'preProduction',
};
