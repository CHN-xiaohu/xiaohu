import { IRoute } from '@umijs/types';

export default [
  {
    path: '/system',
    title: '系统管理',
    hideBreadcrumb: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/system/sms',
        name: '短信管理',
        title: 'sms',
        component: './Sms',
      },
      {
        path: '/system/platform',
        name: '平台信息',
        title: 'platform',
        component: './Platform/Form',
      },
      {
        path: '/system/deploy',
        name: '系统配置',
        title: 'deploy',
        component: './SystemDeploy/Form',
      },
      {
        path: '/system/dept',
        name: '机构管理',
        title: 'dept',
        component: './System/Dept/List',
      },
      {
        path: '/system/dept/add/:id?',
        name: '机构编辑',
        title: 'dept.add',
        component: './System/Dept/Form',
      },
      {
        path: '/system/dept/detail/:id',
        name: '机构修改',
        title: 'dept.detail',
        component: './System/Dept/Detail',
      },
      {
        path: '/system/user',
        name: '用户管理',
        title: 'user',
        component: './System/User/List',
      },
      {
        path: '/system/user/add',
        name: '添加用户',
        title: 'user.add',
        component: './System/User/Form',
      },
      {
        path: '/system/user/edit/:id',
        name: '修改用户',
        title: 'user.edit',
        component: './System/User/Form',
      },
      {
        path: '/system/user/detail/:id',
        name: '用户详情',
        title: 'user.detail',
        component: './System/User/Form',
      },
      {
        path: '/system/menu',
        name: '菜单管理',
        title: 'menu',
        component: './System/Menu/List',
      },
      {
        path: '/system/menu/form/:id?',
        name: '菜单编辑',
        title: 'menu.form',
        component: './System/Menu/Form',
      },
      {
        path: '/system/menu/detail/:id',
        name: '菜单详情',
        title: 'menu.detail',
        component: './System/Menu/Form',
      },
      {
        path: '/system/miniDeploy',
        name: '小程序配置',
        title: 'miniDeploy',
        component: './System/MiniDeploy/Form',
      },
      {
        path: '/system/receiptPrinter',
        name: '小票打印机',
        title: 'receiptPrinter',
        component: './System/ReceiptPrinter/List',
      },
      {
        path: '/system/mallConfig',
        name: 'PC商城配置',
        title: 'mallConfig',
        component: './System/MallConfig/Form',
      },
      {
        path: '/system/domainName',
        name: '域名管理',
        title: 'domainName',
        component: './System/DomainName',
      },
      {
        path: '/system/official-accounts',
        name: '公众号配置',
        title: 'officialAccounts',
        component: './System/OfficialAccounts',
      },
      {
        path: '/system/message-notification',
        name: '消息通知',
        title: 'messageNotification',
        component: './System/MessageNotification',
      },
    ].map((item) => {
      const result = { ...item, title: `menu.system.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
