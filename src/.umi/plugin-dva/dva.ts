// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from '/Users/atzcl/react/zaiwuxian/saas-manager/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';
import ModelApp0 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/App.ts';
import ModelSettings1 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/Settings.ts';
import ModelUser2 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/models/User.ts';
import ModelSalesman3 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/Salesman/models/Salesman.ts';
import ModelMerchant4 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Merchant/models/Merchant.ts';
import ModelCoupon5 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/models/coupon.ts';
import ModelDisplayCategory6 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DisplayCategory/models/DisplayCategory.ts';
import ModelTopic7 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Topic/models/topic.ts';
import ModelNews8 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/News/models/News.ts';
import ModelPcColumn9 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/PcColumn/models/PcColumn.ts';
import ModelCategory10 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Category.ts';
import ModelDistribution11 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Distribution.ts';
import ModelProduct12 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Product.ts';
import ModelSupply13 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/models/Supply.ts';
import ModelPrograma14 from '/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Programa/models/programa.ts';
import dvaImmer, { enableES5, enableAllPlugins } from '/Users/atzcl/react/zaiwuxian/saas-manager/node_modules/dva-immer/dist/index.js';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  app.use(dvaImmer());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'App', ...ModelApp0 });
app.model({ namespace: 'Settings', ...ModelSettings1 });
app.model({ namespace: 'User', ...ModelUser2 });
app.model({ namespace: 'Salesman', ...ModelSalesman3 });
app.model({ namespace: 'Merchant', ...ModelMerchant4 });
app.model({ namespace: 'coupon', ...ModelCoupon5 });
app.model({ namespace: 'DisplayCategory', ...ModelDisplayCategory6 });
app.model({ namespace: 'topic', ...ModelTopic7 });
app.model({ namespace: 'News', ...ModelNews8 });
app.model({ namespace: 'PcColumn', ...ModelPcColumn9 });
app.model({ namespace: 'Category', ...ModelCategory10 });
app.model({ namespace: 'Distribution', ...ModelDistribution11 });
app.model({ namespace: 'Product', ...ModelProduct12 });
app.model({ namespace: 'Supply', ...ModelSupply13 });
app.model({ namespace: 'programa', ...ModelPrograma14 });
  return app;
}

export function getApp() {
  return app;
}

/**
 * whether browser env
 * 
 * @returns boolean
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (isBrowser()) {
      _onCreate()
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
