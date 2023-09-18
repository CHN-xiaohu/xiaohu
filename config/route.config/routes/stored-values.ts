import { IRoute } from '@umijs/types';

export default [
  {
    path: '/stored-values',
    title: 'menu.storedValues',
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/stored-values',
        name: '储值管理',
        title: 'menu.storedValues',
        component: './StoredValue',
      },
      {
        path: '/stored-values/form/:id?',
        name: '储值表单',
        title: 'menu.storedValues.form',
        edit_title: 'menu.storedValues.form_edit',
        component: './StoredValue/Form',
      },
      {
        path: '/stored-values/:id',
        name: '储值详情',
        title: 'menu.storedValues.detail',
        component: './StoredValue/Detail',
      },
    ],
  },
] as IRoute[];
