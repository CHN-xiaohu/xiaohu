import { IRoute } from '@umijs/types';

export default [
  {
    path: '/miniProgram',
    title: '小程序运营',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/miniProgram/topic',
        name: '专题管理',
        title: 'topic',
        component: './MiniProgram/Topic/List',
      },
      {
        path: '/miniProgram/topic/form/:id?',
        name: '专题编辑',
        title: 'topic.form',
        component: './MiniProgram/Topic/Form',
      },
      {
        path: '/miniProgram/miniAdv',
        name: '小程序广告管理',
        title: 'miniAdv',
        component: './Adv/List',
      },
      {
        path: '/miniProgram/miniAdv/detail/:id',
        name: '小程序广告详情',
        title: 'miniAdv.detail',
        component: './Adv/Detail',
      },
      {
        path: '/miniProgram/miniCatetory',
        name: '运营类目管理',
        title: 'miniCatetory',
        component: './DisplayCategory',
      },
      {
        path: '/miniProgram/coupon',
        name: '优惠券管理',
        title: 'coupon',
        component: './Coupon/List',
      },
      {
        path: '/miniProgram/coupon/detail/:id',
        name: '优惠券详情',
        title: 'coupon.detail',
        component: './Coupon/Detail',
      },
      {
        path: '/miniProgram/coupon/form/:id?',
        name: '编辑优惠券',
        title: 'coupon.form',
        component: './Coupon/Form',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.miniProgram.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
