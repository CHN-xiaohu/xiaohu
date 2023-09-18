import { IRoute } from '@umijs/types';

export default [
  {
    path: '/consumer',
    title: '客户管理',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/consumer/merchant',
        name: '商家列表',
        title: 'merchant',
        component: './Consumer/Merchant/List',
      },
      {
        path: '/consumer/supplier',
        name: '供应商列表',
        title: 'supplier',
        component: './Consumer/Supplier/List',
      },
      {
        path: '/consumer/partner',
        name: '合伙人列表',
        title: 'partner',
        component: './Consumer/Partner/List',
      },
      {
        path: '/consumer/miniUser',
        name: '小程序客户列表',
        title: 'miniUser',
        component: './MiniProgram/User',
      },
      {
        path: '/consumer/designer',
        name: '导购设计师',
        title: 'designer',
        component: './Consumer/Designer',
      },
      {
        path: '/consumer/storeInfo',
        name: '商家信息',
        title: 'storeInfo',
        component: './Consumer/StoreInfo/Form',
      },
      {
        path: '/consumer/collectionDistributor',
        name: '集采分销商',
        title: 'collectionDistributor',
        component: './Consumer/CollectionDistributor/List',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.consumer.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
