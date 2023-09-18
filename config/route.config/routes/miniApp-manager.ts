import { IRoute } from '@umijs/types';

export default [
  {
    path: '/miniProgramManager',
    title: '小程序管理',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/miniProgramManager/codeTemplate',
        name: '代码模板管理',
        title: 'codeTemplate',
        component: './MiniProgramManager/CodeTemplate',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.miniProgramManager.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
