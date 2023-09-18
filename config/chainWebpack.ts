// eslint-disable-next-line import/no-extraneous-dependencies
import IWebpackChainConfig from 'webpack-chain';
// import { applyCKEditorRulesByUmi } from '@spark-build/ckeditor-5/lib/chainWebpack';
import path from 'path';

export const resolve = (filePath: string) =>
  path.resolve('src', filePath ? `${filePath}/` : filePath);

// function getModulePackageName(module: any) {
//   if (!module.context) return null;

//   const nodeModulesPath = path.join(__dirname, '../node_modules/');
//   if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
//     return null;
//   }

//   const moduleRelativePath = module.context.substring(nodeModulesPath.length);
//   const [moduleDirName] = moduleRelativePath.split(path.sep);
//   let packageName = moduleDirName;
//   // handle tree shaking
//   if (packageName.match('^_')) {
//     // eslint-disable-next-line prefer-destructuring
//     packageName = packageName.match(/^_(@?[^@]+)/)[1];
//   }
//   return packageName;
// }

function applyStyleResources(config: IWebpackChainConfig) {
  config.module
    .rule('less-loader')
    .use('style-resources-loader')
    .loader('style-resources-loader')
    // .loader(require.resolve('style-resources-loader'))
    .options({
      patterns: resolve('assets/css/global_variable.less'),
    })
    .end();
}

function applyOptimization(config: IWebpackChainConfig) {
  // 抽取公共依赖
  config.optimization.runtimeChunk(false).splitChunks({
    cacheGroups: {
      vendors: {
        chunks: 'initial',
        name: 'vendors',
        priority: 30,
        enforce: true,
        test: /[\\/]node_modules[\\/]/,
      },

      vendorCommon: {
        chunks: 'all',
        name: 'vendor-commons',
        minChunks: 2,
        priority: 20,
        test: /[\\/]node_modules[\\/]/,
        reuseExistingChunk: true,
      },

      common: {
        chunks: 'all',
        name: 'commons',
        minChunks: 2,
        priority: 10,
        test: /[\\/]src[\\/]/,
        reuseExistingChunk: true,
      },
    },
  });
}

function applyLodashPlugin(config: IWebpackChainConfig) {
  config.plugin('lodash-webpack-plugin').use(require.resolve('lodash-webpack-plugin')).end();
}

export default (config: IWebpackChainConfig) => {
  // ckeditor
  // applyCKEditorRulesByUmi(config);

  // 减少 lodash 大小
  applyLodashPlugin(config);

  // 自动注入全局变量
  // applyStyleResources(config);

  // 抽取公共依赖
  applyOptimization(config);
};
