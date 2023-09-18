import { IRoute } from '@umijs/types';

export default [
  {
    path: '/orders',
    title: '订单管理',
    hideBreadcrumb: true,
    routes: [
      {
        path: '/orders/purchase',
        name: '订单管理',
        title: 'purchase',
        component: './Order',
      },
      {
        path: '/orders/purchase/detail/:id',
        name: '订单详情',
        title: 'purchase.detail',
        component: './Order/Detail',
      },
      {
        path: '/orders/sales',
        name: '销售单管理',
        title: 'sales',
        component: './Order',
      },
      {
        path: '/orders/sales/detail/:id',
        name: '订单详情',
        title: 'sales.detail',
        component: './Order/Detail',
      },
      {
        path: '/orders/supplier',
        name: '分销采购单',
        title: 'supplier',
        component: './Order/SupplierOrder/List',
      },
      {
        path: '/orders/nextDistributionPurchaseOrder',
        name: '下分销采购单',
        title: 'nextDistributionPurchaseOrder',
        component: './Order/NextDistributionPurchaseOrder',
      },
      {
        path: '/orders/supplier/detail/:id',
        name: '分销采购单详情',
        title: 'supplier.detail',
        component: './Order/Detail',
      },
      {
        path: '/orders/brandSupplier',
        name: '分销供货单',
        title: 'brandSupplier',
        component: './Order/SupplierOrder/List',
      },
      {
        path: '/orders/brandSupplier/detail/:id',
        name: '分销供货单详情',
        title: 'brandSupplier',
        component: './Order/Detail',
      },
      // 品牌商品采购
      {
        page: '/orders/goPcPurchaseProduct',
        title: 'goPcPurchaseProduct',
        name: '品牌商品采购',
        component: './Order/PCBrandProductPurchase',
      }
    ].map((item) => {
      const result = { ...item, title: `menu.orders.${item.title}` };
      return result;
    }),
  },
] as IRoute[];
