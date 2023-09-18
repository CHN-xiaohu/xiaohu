import { IRoute } from '@umijs/types';

export default [
  {
    path: '/order',
    name: '订单管理',
    title: 'order',
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/order',
        name: '订单管理',
        title: 'order',
        component: './Order',
      },
      {
        path: '/order/:id',
        name: '订单详情',
        title: 'order.detail',
        component: './Order/Detail',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
