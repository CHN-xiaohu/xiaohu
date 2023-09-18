import { createRoutes } from '../util';

export default createRoutes(
  [
    {
      path: '/product',
      title: 'product',
      hideBreadcrumb: true,
      redirectUrl: '/product/manager',
      // component: '../layouts/ChildrenContainer',
      routes: [
        {
          path: '/product/category',
          title: 'category',
          name: '商品分类',
          component: './Product/Category',
        },

        {
          path: '/product/manager',
          title: 'manager',
          name: '商品列表',
          component: './Product/Manager',
        },
        {
          path: '/product/manager/form/:id?',
          name: '商品表单',
          title: 'manager.form',
          edit_title: 'manager.form_edit',
          component: './Product/Manager/Form',
        },
        {
          path: '/product/manager/view/:id',
          name: '查看商品',
          title: 'manager.view',
          component: './Product/Manager/View',
        },

        {
          path: '/product/miniprogram',
          title: 'miniprogram',
          miniprogram: true,
          name: '小程序商品列表',
          component: './Product/Miniprogram',
        },
        {
          path: '/product/miniprogram/form/:id?',
          name: '小程序商品表单',
          title: 'miniprogram.form',
          edit_title: 'miniprogram.form_edit',
          miniprogram: true,
          component: './Product/Manager/Form',
        },
        {
          path: '/product/miniprogram/view/:id',
          name: '查看小程序商品',
          title: 'miniprogram.view',
          notShelves: true,
          miniprogram: true,
          component: './Product/Manager/View',
        },

        // 供货商品
        {
          path: '/product/supply',
          name: '供货商品',
          title: 'supply',
          notShelves: true,
          miniprogram: true,
          component: './Product/Supply',
        },
        {
          path: '/product/supply/form/:id?',
          name: '供货商品表单',
          title: 'supply.form',
          edit_title: 'supply.form_edit',
          miniprogram: true,
          component: './Product/Supply/Form',
        },
        {
          path: '/product/supply/view/:id',
          name: '查看商品',
          title: 'supply.view',
          component: './Product/Supply/View',
        },
        {
          path: '/product/supply/snapshot/:id',
          name: '查看商品快照',
          isSnapshot: true,
          title: 'supply.snapshot',
          component: './Product/Supply/View',
        },

        // 分销商品
        {
          path: '/product/distribution',
          name: '分销商品',
          title: 'distribution',
          notShelves: true,
          miniprogram: true,
          component: './Product/Distribution',
        },
        {
          path: '/product/distribution/form/:id?',
          name: '分销商品表单',
          title: 'distribution.form',
          edit_title: 'distribution.form_edit',
          miniprogram: true,
          component: './Product/Distribution/Form',
        },
        {
          path: '/product/distribution/view/:id',
          name: '查看商品',
          title: 'distribution.view',
          component: './Product/Distribution/View',
        },
        {
          path: '/product/distribution/snapshot/:id',
          name: '查看商品快照',
          isSnapshot: true,
          title: 'distribution.snapshot',
          component: './Product/Distribution/View',
        },
        {
          path: '/product/groups',
          name: '商品分组管理',
          title: 'groups',
          component: './Product/Groups',
        },

        // 咋装云
        {
          path: '/product/propertyKey',
          name: '商品属性',
          title: 'property',
          component: './Product/Property',
        },

        {
          path: '/product/paramsKey',
          title: 'params',
          name: '商品参数',
          component: './Product/Params',
        },

        {
          path: '/product/brand',
          title: 'brand',
          name: '商品品牌',
          component: './Product/Brand',
        },
        {
          path: '/product/merchantSelfGoods',
          title: 'merchantSelfGoods',
          name: '商品列表',
          component: './Product/MerchantSelfGoods',
        },
        {
          path: '/product/merchantSelfGoods/view/:id',
          name: '查看商品',
          title: 'merchantSelfGoods.view',
          component: './Product/MerchantSelfGoods/View',
        },
      ],
    },
  ],
  'menu',
);
