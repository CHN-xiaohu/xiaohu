import { RouteItem } from '../../../src/typings/app.d';

export default [
  {
    path: '/finances',
    title: 'menu.finances',
    notShowLink: true,
    // component: '../layouts/ChildrenContainer',
    routes: [
      {
        path: '/finances/merchants-balance',
        name: '商家余额',
        title: 'menu.finances.merchants-balance',
        component: './Finance/Balance/Merchant',
      },
      {
        path: '/finances/account-balance',
        name: '账户余额',
        title: 'menu.finances.account-balance',
        component: './Finance/Balance/Account',
      },
      {
        path: '/finances/purchase-single-payment',
        name: '采购单支付',
        title: 'menu.finances.purchase-single-payment',
        component: './Finance/Balance/PurchasePayment',
      },
      {
        path: '/finances/sales-payment',
        name: '销售单支付',
        title: 'menu.finances.sales-payment',
        component: './Finance/Balance/SalesPayment',
      },
      {
        path: '/finances/export-data-report/:reportType?',
        name: '导出数据报表',
        title: 'menu.finances.export-data-report',
        component: './Finance/Balance/ExportDataReport',
      },
    ],
  },
] as RouteItem[];
