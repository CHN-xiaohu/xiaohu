import { createRoutes } from '../util';

export default createRoutes(
  [
    {
      path: '/mini-program',
      title: 'miniProgram',
      hideBreadcrumb: true,
      redirectUrl: '/mini-program/livemp/room',
      routes: [
        {
          path: '/mini-program/livemp',
          title: 'livemp',
          hideBreadcrumb: true,
          redirectUrl: '/mini-program/livemp/room',
          routes: [
            {
              path: '/mini-program/livemp/room',
              title: 'room',
              name: '小程序直播间',
              component: './MiniProgram/Livemp/Room',
            },
            {
              path: '/mini-program/livemp/product',
              title: 'product',
              name: '小程序直播商品',
              component: './MiniProgram/Livemp/Product',
            },
          ],
        },
      ],
    },
  ],
  'menu',
);
