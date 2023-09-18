import { IRoute } from '@umijs/types';

export default [
  {
    path: '/authority',
    title: '权限管理',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/authority/role',
        name: '角色列表',
        title: 'role',
        component: './Authority/Role/List',
      },
      {
        path: '/authority/role/add/:id?',
        name: '角色编辑',
        title: 'role.add',
        component: './Authority/Role/Form',
      },
      {
        path: '/authority/role/detail/:id',
        name: '角色详情',
        title: 'role.detail',
        component: './Authority/Role/Form',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.authority.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
