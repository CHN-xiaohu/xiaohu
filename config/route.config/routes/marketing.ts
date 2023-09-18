import { RouteItem } from '../../../src/typings/app.d';

export default [
  {
    path: '/marketings',
    title: 'menu.marketings',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/marketings/group-buys',
        name: '团购',
        title: 'menu.marketing.groupBuys',
        component: './Marketing/GroupBuy',
      },
      {
        path: '/marketings/group-buys/:id',
        name: '团购详情',
        title: 'menu.marketing.groupBuys.detail',
        component: './Marketing/GroupBuy/Detail',
      },
    ],
  },
] as RouteItem[];
