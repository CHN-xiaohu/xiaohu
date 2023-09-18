import { IRoute } from '@umijs/types';

export default [
  {
    path: '/dashboard',
    name: '工作台',
    title: 'dashboard',
    redirectUrl: '/dashboard/workplace',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/dashboard/workplace',
        name: '工作场所',
        title: 'dashboard.workplace',
        hideBreadcrumb: true,
        component: './Dashboard/Workplace',
      },
    ],
  },
] as IRoute[];
