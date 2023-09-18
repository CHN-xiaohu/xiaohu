import { IRoute } from '@umijs/types';

export default [
  {
    path: '/appCenter',
    title: 'appCenter',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/appCenter/salesman',
        name: '业务员',
        title: 'salesman',
        component: './ApplicationCenter/Salesman',
      },
      {
        path: '/appCenter/salesman/detail/:id',
        name: '业务员详情',
        title: 'salesman.detail',
        component: './ApplicationCenter/Salesman/Detail',
      },
      {
        path: '/appCenter/distributor',
        name: '分销员',
        title: 'distributor',
        component: './ApplicationCenter/Distributor',
      },
      {
        path: '/appCenter/activity',
        name: '活动管理',
        title: 'activity',
        component: './ApplicationCenter/ActivityManager',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.appCenter.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
