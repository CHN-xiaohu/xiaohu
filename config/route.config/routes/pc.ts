import { IRoute } from '@umijs/types';

export default [
  {
    path: '/pc',
    title: '商城运营',
    hideBreadcrumb: true,

    routes: [
      {
        path: '/pc/column',
        name: '自定义首页栏目',
        title: 'pc.column',
        component: './PcColumn/List',
      },
      {
        path: '/pc/column/form',
        name: '添加自定义首页栏目',
        title: 'pc.column.form',
        component: './PcColumn/Form',
      },
      {
        path: '/pc/column/edit_form/:id',
        name: '添加自定义首页栏目',
        title: 'pc.column.edit_form',
        component: './PcColumn/Form',
      },
      {
        path: '/pc/customPage',
        name: '自定义页面',
        title: 'pc.customPage',
        component: './CustomPage',
      },
      {
        path: '/pc/customPage/form/:id?',
        name: '自定义页面',
        title: 'pc.customPage.form',
        component: './CustomPage/Form',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
