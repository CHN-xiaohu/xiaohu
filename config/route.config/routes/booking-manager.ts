import { IRoute } from '@umijs/types';

export default [
  {
    path: '/bookingManager',
    title: '预约管理',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/bookingManager/list',
        name: '客户预约',
        title: 'List',
        component: './BookingManager/List',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.bookingManager.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
