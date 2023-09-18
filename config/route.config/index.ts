import { IConfig } from '@umijs/types';

/* auto-load-placeholder */
import account from './routes/account';
import appCenter from './routes/app-center';
import app from './routes/app';
import authority from './routes/authority';
import bookingManager from './routes/booking-manager';
import brandOwner from './routes/brand-owner';
import cloudDesign from './routes/cloud-design';
import collectCenter from './routes/collect-center';
import consumer from './routes/consumer';
import dashboard from './routes/dashboard';
import dataCenter from './routes/data-center';
import exception from './routes/exception';
import finances from './routes/finances';
import livemp from './routes/livemp';
import marketing from './routes/marketing';
import merchantManagement from './routes/merchant-management';
import miniProgram from './routes/mini-program';
import miniAppManager from './routes/miniApp-manager';
import orders from './routes/orders';
import pc from './routes/pc';
import product from './routes/product';
import service from './routes/service';
import storedValues from './routes/stored-values';
import supplyProduct from './routes/supply-product';
import system from './routes/system';
import user from './routes/user';
import view from './routes/view';
/* auto-load-placeholder */

export default [
  {
    path: '/',
    component: '../layouts/App',
    name: '首页',
    routes: [
      // user login
      // 重定向
      { path: '/users', redirect: '/users/login' },
      {
        path: '/users',
        component: '../layouts/UserLayout',
        routes: [{ path: '/users/login', name: '登录', title: 'login', component: './User/Login' }],
      },

      // 主要路由
      {
        path: '/',
        /**
         * 用于重定向
         *
         * @see https://github.com/umijs/umi/issues/2087
         */
        redirectUrl: dashboard[0].redirectUrl || '/exception/404',
        component: '../layouts/BasicLayout',
        /* auto-load-use-placeholder */
        routes: [
          ...account,
          ...appCenter,
          ...app,
          ...authority,
          ...bookingManager,
          ...brandOwner,
          ...cloudDesign,
          ...collectCenter,
          ...consumer,
          ...dashboard,
          ...dataCenter,
          ...exception,
          ...finances,
          ...livemp,
          ...marketing,
          ...merchantManagement,
          ...miniProgram,
          ...miniAppManager,
          ...orders,
          ...pc,
          ...product,
          ...service,
          ...storedValues,
          ...supplyProduct,
          ...system,
          ...user,
          ...view,
        ],
        /* auto-load-use-placeholder */
      },
    ],
  },
] as IConfig['routes'];
