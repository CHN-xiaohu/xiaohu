import { createRoutes } from '../util';

export default createRoutes(
  [
    {
      path: '/view',
      title: 'view',
      hideBreadcrumb: true,
      component: './View',
    },
  ],
  'menu',
);
