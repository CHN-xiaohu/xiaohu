import { IRoute } from '@umijs/types';

export default [
  {
    path: '/app',
    title: 'app',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/app/adv',
        name: '广告管理',
        title: 'adv',
        component: './Adv/List',
      },
      {
        path: '/app/adv/detail/:id',
        name: '广告详情',
        title: 'adv.detail',
        component: './Adv/Detail',
      },
      {
        path: '/app/displayCategory',
        name: '运营类目管理',
        title: 'displayCategory',
        component: './DisplayCategory',
      },
      {
        path: '/app/edition',
        name: '版本管理',
        title: 'edition',
        component: './Edition/List',
      },
      {
        path: '/app/news',
        name: '消息推送管理',
        title: 'news',
        component: './News/List',
      },
      {
        path: '/app/news/form',
        name: '新增消息',
        title: 'news.form',
        component: './News/Form',
      },
      {
        path: '/app/news/detail/:id',
        name: '消息详情',
        title: 'news.detail',
        component: './News/Detail',
      },
      {
        path: '/app/coupon/list',
        name: '优惠券列表',
        title: 'coupon',
        component: './Coupon/List',
      },
      {
        path: '/app/coupon/form/:id?',
        name: '编辑优惠券',
        title: 'coupon.form',
        component: './Coupon/Form',
      },
      {
        path: '/app/coupon/detail/:id',
        name: '优惠券详情',
        title: 'coupon.detail',
        component: './Coupon/Detail',
      },
      {
        path: '/app/programa/list',
        name: '自定义首页栏目',
        title: 'programa',
        component: './Programa/List',
      },
      {
        path: '/app/programa/update/:id?',
        name: '编辑自定义首页栏目',
        title: 'programa.update',
        component: './Programa/UpdatePage',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.app.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
