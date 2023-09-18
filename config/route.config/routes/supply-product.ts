import { IRoute } from '@umijs/types';

export default [
  {
    path: '/shareMarketing',
    title: '供货管理',
    hideBreadcrumb: true,

    routes: [
      {
        path: '/shareMarketing/supplyCategory',
        name: '运营类目列表',
        title: 'supplyCategory',
        component: './DisplayCategory',
      },
      {
        path: '/shareMarketing/productList',
        name: '供货商品审核',
        title: 'productList',
        component: './Product/Share',
      },
      {
        path: '/shareMarketing/productDetail/:id',
        name: '供货商品详情',
        title: 'productDetail',
        component: './Product/Share/View',
      },
      {
        path: '/shareMarketing/distributionOrder',
        name: '分销订单',
        title: 'distributionOrder',
        component: './Order/DistributionOrder/List',
      },
      {
        path: '/shareMarketing/distributionOrder/detail/:id',
        name: '分销订单详情',
        title: 'distributionOrder',
        component: './Order/DistributionOrder/Detail',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.shareMarketing.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
