import { IRoute } from '@umijs/types';

export default [
  {
    path: '/merchantManagement',
    title: '商户管理',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/merchantManagement/merchant',
        name: '商户管理',
        title: 'merchant',
        component: './MerchantManagement/Merchant',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.merchantManagement.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
