import { IRoute } from '@umijs/types';

export default [
  {
    path: '/dataCenter',
    title: 'dataCenter',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/dataCenter/productAnalysis',
        name: '商品分析',
        title: 'productAnalysis',
        component: './DataCenter/ProductAnalysis/List',
      },
      {
        path: '/dataCenter/storeEarningReport',
        name: '店铺业绩报表',
        title: 'storeEarningReport',
        component: './DataCenter/StoreEarningReport/List',
      },
      {
        path: '/dataCenter/salesmanEarningReport',
        name: '业务员业绩分析',
        title: 'salesmanEarningReport',
        component: './DataCenter/SalesmanEarningReport/List',
      },
      {
        path: '/dataCenter/distributorEarningReport',
        name: '业务员业绩分析',
        title: 'distributorEarningReport',
        component: './DataCenter/DistributorEarningReport/List',
      },
      {
        path: '/dataCenter/transactionAnalysis',
        name: '业务员业绩分析',
        title: 'distributorEarningReport',
        component: './DataCenter/TransactionAnalysis',
      },
      
    ].map((item) => {
      const result = { ...item, title: `menu.dataCenter.${item.title}` };
      return result;
    }),
  },
] as IRoute[];