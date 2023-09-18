import { IRoute } from '@umijs/types';

export default [
  {
    path: '/account',
    title: '权限管理',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/account/password',
        name: '角色列表',
        title: 'password',
        component: './UserInfo/Form',
      },
      {
        path: '/account/settings',
        name: '角色列表',
        title: 'settings',
        component: './UserInfo/Form',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.account.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
