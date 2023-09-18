import { IRoute } from '@umijs/types';

export default [
  {
    path: '/collection',
    title: 'collection',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/collection/collectCenter',
        name: '采集中心',
        title: 'collectCenter',
        component: './CollectCenter/List',
      },
      {
        path: '/collection/Product/detail/:id',
        name: '采集商品详情',
        title: 'Product.detail',
        component: './CollectCenter/Product/Detail',
      },
      {
        path: '/collection/productChange',
        title: 'productChange',
        name: '商品变更',
        component: './ProductChange/List',
      },
      {
        path: '/collection/distributionApplication',
        name: '我的分销申请',
        title: 'distributionApplication',
        component: './CollectCenter/DistributionApplication',
      },
      {
        path: '/collection/distributionManagement',
        name: '渠道分销管理',
        title: 'distributionManagement',
        component: './CollectCenter/DistributionManagement',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.collection.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
