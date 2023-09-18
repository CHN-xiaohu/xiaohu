import { IRoute } from '@umijs/types';

export default [
  {
    path: '/cloudDesign',
    title: 'cloudDesign',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/cloudDesign/project',
        name: '方案管理',
        title: 'project',
        component: './CloudDesign/Project/List',
      },
      {
        path: '/cloudDesign/design',
        name: '酷家乐页面',
        title: 'design',
        component: './CloudDesign/KujialeDesign',
      },
      {
        path: '/cloudDesign/model',
        name: '商品模型关联',
        title: 'model',
        component: './CloudDesign/ModelManage/List',
      },
      {
        path: '/cloudDesign/store-project',
        name: '门店方案管理',
        title: 'store-project',
        component: './CloudDesign/StoreProject/List',
      },
      {
        path: '/cloudDesign/application-design',
        name: '预约设计',
        title: 'application-design',
        component: './CloudDesign/ApplicationDesign',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.cloudDesign.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
