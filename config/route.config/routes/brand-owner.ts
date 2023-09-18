import { IRoute } from '@umijs/types';

export default [
  {
    path: '/brandOwner',
    title: 'brandOwner',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/brandOwner/manage',
        name: '品牌商列表',
        title: 'manage',
        component: './BrandOwner/List',
      },
      {
        path: '/brandOwner/serviceManageList/:id',
        name: '开通服务',
        title: 'serviceManageList',
        component: './BrandOwner/ServiceManage',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.brandOwner.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
