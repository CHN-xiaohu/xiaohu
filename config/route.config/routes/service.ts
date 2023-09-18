import { IRoute } from '@umijs/types';

export default [
  {
    path: '/service',
    title: 'menu.service',
    routes: [
      {
        path: '/service',
        name: '服务管理',
        title: 'menu.service',
        component: './Service',
      },
      {
        path: '/service/form/:id?',
        name: '服务表单',
        title: 'menu.service.form',
        edit_title: 'menu.service.form_edit',
        component: './Service/Form',
      },
    ],
  },
] as IRoute[];
