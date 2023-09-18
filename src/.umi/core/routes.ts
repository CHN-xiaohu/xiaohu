// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/atzcl/react/zaiwuxian/saas-manager/node_modules/umi/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/Loading';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__App' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/layouts/App'), loading: LoadingComponent}),
    "name": "首页",
    "routes": [
      {
        "path": "/users",
        "redirect": "/users/login",
        "exact": true
      },
      {
        "path": "/users",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/layouts/UserLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/users/login",
            "name": "登录",
            "title": "login",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__User__Login' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/User/Login'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/",
        "redirectUrl": "/dashboard/workplace",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/layouts/BasicLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/account",
            "title": "权限管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/account/password",
                "name": "角色列表",
                "title": "menu.account.password",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__UserInfo__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/UserInfo/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/account/settings",
                "name": "角色列表",
                "title": "menu.account.settings",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__UserInfo__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/UserInfo/Form'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/appCenter",
            "title": "appCenter",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/appCenter/salesman",
                "name": "业务员",
                "title": "menu.appCenter.salesman",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ApplicationCenter__Salesman' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/Salesman'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/appCenter/salesman/detail/:id",
                "name": "业务员详情",
                "title": "menu.appCenter.salesman.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ApplicationCenter__Salesman__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/Salesman/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/appCenter/distributor",
                "name": "分销员",
                "title": "menu.appCenter.distributor",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ApplicationCenter__Distributor' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/Distributor'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/appCenter/activity",
                "name": "活动管理",
                "title": "menu.appCenter.activity",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ApplicationCenter__ActivityManager' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ApplicationCenter/ActivityManager'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/app",
            "title": "app",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/app/adv",
                "name": "广告管理",
                "title": "menu.app.adv",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Adv__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Adv/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/adv/detail/:id",
                "name": "广告详情",
                "title": "menu.app.adv.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Adv__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Adv/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/displayCategory",
                "name": "运营类目管理",
                "title": "menu.app.displayCategory",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DisplayCategory' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DisplayCategory'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/edition",
                "name": "版本管理",
                "title": "menu.app.edition",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Edition__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Edition/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/news",
                "name": "消息推送管理",
                "title": "menu.app.news",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__News__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/News/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/news/form",
                "name": "新增消息",
                "title": "menu.app.news.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__News__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/News/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/news/detail/:id",
                "name": "消息详情",
                "title": "menu.app.news.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__News__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/News/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/coupon/list",
                "name": "优惠券列表",
                "title": "menu.app.coupon",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/coupon/form/:id?",
                "name": "编辑优惠券",
                "title": "menu.app.coupon.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/coupon/detail/:id",
                "name": "优惠券详情",
                "title": "menu.app.coupon.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/programa/list",
                "name": "自定义首页栏目",
                "title": "menu.app.programa",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Programa__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Programa/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/app/programa/update/:id?",
                "name": "编辑自定义首页栏目",
                "title": "menu.app.programa.update",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Programa__UpdatePage' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Programa/UpdatePage'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/authority",
            "title": "权限管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/authority/role",
                "name": "角色列表",
                "title": "menu.authority.role",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Authority__Role__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Authority/Role/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/authority/role/add/:id?",
                "name": "角色编辑",
                "title": "menu.authority.role.add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Authority__Role__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Authority/Role/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/authority/role/detail/:id",
                "name": "角色详情",
                "title": "menu.authority.role.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Authority__Role__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Authority/Role/Form'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/bookingManager",
            "title": "预约管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/bookingManager/list",
                "name": "客户预约",
                "title": "menu.bookingManager.List",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__BookingManager__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/BookingManager/List'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/brandOwner",
            "title": "brandOwner",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/brandOwner/manage",
                "name": "品牌商列表",
                "title": "menu.brandOwner.manage",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__BrandOwner__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/BrandOwner/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/brandOwner/serviceManageList/:id",
                "name": "开通服务",
                "title": "menu.brandOwner.serviceManageList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__BrandOwner__ServiceManage' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/BrandOwner/ServiceManage'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/cloudDesign",
            "title": "cloudDesign",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/cloudDesign/project",
                "name": "方案管理",
                "title": "menu.cloudDesign.project",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CloudDesign__Project__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CloudDesign/Project/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/cloudDesign/design",
                "name": "酷家乐页面",
                "title": "menu.cloudDesign.design",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CloudDesign__KujialeDesign' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CloudDesign/KujialeDesign'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/cloudDesign/model",
                "name": "商品模型关联",
                "title": "menu.cloudDesign.model",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CloudDesign__ModelManage__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CloudDesign/ModelManage/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/cloudDesign/store-project",
                "name": "门店方案管理",
                "title": "menu.cloudDesign.store-project",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CloudDesign__StoreProject__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CloudDesign/StoreProject/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/cloudDesign/application-design",
                "name": "预约设计",
                "title": "menu.cloudDesign.application-design",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CloudDesign__ApplicationDesign' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CloudDesign/ApplicationDesign'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/collection",
            "title": "collection",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/collection/collectCenter",
                "name": "采集中心",
                "title": "menu.collection.collectCenter",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CollectCenter__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CollectCenter/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/collection/Product/detail/:id",
                "name": "采集商品详情",
                "title": "menu.collection.Product.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CollectCenter__Product__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CollectCenter/Product/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/collection/productChange",
                "title": "menu.collection.productChange",
                "name": "商品变更",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__ProductChange__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/ProductChange/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/collection/distributionApplication",
                "name": "我的分销申请",
                "title": "menu.collection.distributionApplication",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CollectCenter__DistributionApplication' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CollectCenter/DistributionApplication'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/collection/distributionManagement",
                "name": "渠道分销管理",
                "title": "menu.collection.distributionManagement",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CollectCenter__DistributionManagement' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CollectCenter/DistributionManagement'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/consumer",
            "title": "客户管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/consumer/merchant",
                "name": "商家列表",
                "title": "menu.consumer.merchant",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__Merchant__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Merchant/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/supplier",
                "name": "供应商列表",
                "title": "menu.consumer.supplier",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__Supplier__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Supplier/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/partner",
                "name": "合伙人列表",
                "title": "menu.consumer.partner",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__Partner__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Partner/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/miniUser",
                "name": "小程序客户列表",
                "title": "menu.consumer.miniUser",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgram__User' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/User'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/designer",
                "name": "导购设计师",
                "title": "menu.consumer.designer",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__Designer' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/Designer'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/storeInfo",
                "name": "商家信息",
                "title": "menu.consumer.storeInfo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__StoreInfo__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/StoreInfo/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/consumer/collectionDistributor",
                "name": "集采分销商",
                "title": "menu.consumer.collectionDistributor",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Consumer__CollectionDistributor__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Consumer/CollectionDistributor/List'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/dashboard",
            "name": "工作台",
            "title": "dashboard",
            "redirectUrl": "/dashboard/workplace",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/dashboard/workplace",
                "name": "工作场所",
                "title": "dashboard.workplace",
                "hideBreadcrumb": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Dashboard__Workplace' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Dashboard/Workplace'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/dataCenter",
            "title": "dataCenter",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/dataCenter/productAnalysis",
                "name": "商品分析",
                "title": "menu.dataCenter.productAnalysis",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataCenter__ProductAnalysis__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DataCenter/ProductAnalysis/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataCenter/storeEarningReport",
                "name": "店铺业绩报表",
                "title": "menu.dataCenter.storeEarningReport",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataCenter__StoreEarningReport__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DataCenter/StoreEarningReport/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataCenter/salesmanEarningReport",
                "name": "业务员业绩分析",
                "title": "menu.dataCenter.salesmanEarningReport",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataCenter__SalesmanEarningReport__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DataCenter/SalesmanEarningReport/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataCenter/distributorEarningReport",
                "name": "业务员业绩分析",
                "title": "menu.dataCenter.distributorEarningReport",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataCenter__DistributorEarningReport__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DataCenter/DistributorEarningReport/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/dataCenter/transactionAnalysis",
                "name": "业务员业绩分析",
                "title": "menu.dataCenter.distributorEarningReport",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DataCenter__TransactionAnalysis' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DataCenter/TransactionAnalysis'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/exception",
            "routes": [
              {
                "path": "/exception/403",
                "name": "not-permission",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Exception__403' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Exception/403'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/exception/404",
                "name": "not-find",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Exception__404' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Exception/404'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/exception/500",
                "name": "server-error",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Exception__500' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Exception/500'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/finances",
            "title": "menu.finances",
            "notShowLink": true,
            "routes": [
              {
                "path": "/finances/merchants-balance",
                "name": "商家余额",
                "title": "menu.finances.merchants-balance",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Finance__Balance__Merchant' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Finance/Balance/Merchant'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/finances/account-balance",
                "name": "账户余额",
                "title": "menu.finances.account-balance",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Finance__Balance__Account' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Finance/Balance/Account'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/finances/purchase-single-payment",
                "name": "采购单支付",
                "title": "menu.finances.purchase-single-payment",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Finance__Balance__PurchasePayment' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Finance/Balance/PurchasePayment'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/finances/sales-payment",
                "name": "销售单支付",
                "title": "menu.finances.sales-payment",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Finance__Balance__SalesPayment' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Finance/Balance/SalesPayment'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/finances/export-data-report/:reportType?",
                "name": "导出数据报表",
                "title": "menu.finances.export-data-report",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Finance__Balance__ExportDataReport' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Finance/Balance/ExportDataReport'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/mini-program",
            "title": "menu.miniProgram",
            "hideBreadcrumb": true,
            "redirectUrl": "/mini-program/livemp/room",
            "routes": [
              {
                "path": "/mini-program/livemp",
                "title": "menu.miniProgram.livemp",
                "hideBreadcrumb": true,
                "redirectUrl": "/mini-program/livemp/room",
                "routes": [
                  {
                    "path": "/mini-program/livemp/room",
                    "title": "menu.miniProgram.livemp.room",
                    "name": "小程序直播间",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgram__Livemp__Room' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Livemp/Room'), loading: LoadingComponent}),
                    "exact": true
                  },
                  {
                    "path": "/mini-program/livemp/product",
                    "title": "menu.miniProgram.livemp.product",
                    "name": "小程序直播商品",
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgram__Livemp__Product' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Livemp/Product'), loading: LoadingComponent}),
                    "exact": true
                  }
                ]
              }
            ]
          },
          {
            "path": "/marketings",
            "title": "menu.marketings",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/marketings/group-buys",
                "name": "团购",
                "title": "menu.marketing.groupBuys",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__GroupBuy' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Marketing/GroupBuy'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/marketings/group-buys/:id",
                "name": "团购详情",
                "title": "menu.marketing.groupBuys.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Marketing__GroupBuy__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Marketing/GroupBuy/Detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/merchantManagement",
            "title": "商户管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/merchantManagement/merchant",
                "name": "商户管理",
                "title": "menu.merchantManagement.merchant",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MerchantManagement__Merchant' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MerchantManagement/Merchant'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/miniProgram",
            "title": "小程序运营",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/miniProgram/topic",
                "name": "专题管理",
                "title": "menu.miniProgram.topic",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgram__Topic__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Topic/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/topic/form/:id?",
                "name": "专题编辑",
                "title": "menu.miniProgram.topic.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgram__Topic__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgram/Topic/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/miniAdv",
                "name": "小程序广告管理",
                "title": "menu.miniProgram.miniAdv",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Adv__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Adv/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/miniAdv/detail/:id",
                "name": "小程序广告详情",
                "title": "menu.miniProgram.miniAdv.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Adv__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Adv/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/miniCatetory",
                "name": "运营类目管理",
                "title": "menu.miniProgram.miniCatetory",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DisplayCategory' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DisplayCategory'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/coupon",
                "name": "优惠券管理",
                "title": "menu.miniProgram.coupon",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/coupon/detail/:id",
                "name": "优惠券详情",
                "title": "menu.miniProgram.coupon.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/miniProgram/coupon/form/:id?",
                "name": "编辑优惠券",
                "title": "menu.miniProgram.coupon.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Coupon__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Coupon/Form'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/miniProgramManager",
            "title": "小程序管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/miniProgramManager/codeTemplate",
                "name": "代码模板管理",
                "title": "menu.miniProgramManager.codeTemplate",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__MiniProgramManager__CodeTemplate' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/MiniProgramManager/CodeTemplate'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/orders",
            "title": "订单管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/orders/purchase",
                "name": "订单管理",
                "title": "menu.orders.purchase",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/purchase/detail/:id",
                "name": "订单详情",
                "title": "menu.orders.purchase.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/sales",
                "name": "销售单管理",
                "title": "menu.orders.sales",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/sales/detail/:id",
                "name": "订单详情",
                "title": "menu.orders.sales.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/supplier",
                "name": "分销采购单",
                "title": "menu.orders.supplier",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__SupplierOrder__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/SupplierOrder/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/nextDistributionPurchaseOrder",
                "name": "下分销采购单",
                "title": "menu.orders.nextDistributionPurchaseOrder",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__NextDistributionPurchaseOrder' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/NextDistributionPurchaseOrder'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/supplier/detail/:id",
                "name": "分销采购单详情",
                "title": "menu.orders.supplier.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/brandSupplier",
                "name": "分销供货单",
                "title": "menu.orders.brandSupplier",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__SupplierOrder__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/SupplierOrder/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/orders/brandSupplier/detail/:id",
                "name": "分销供货单详情",
                "title": "menu.orders.brandSupplier",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "page": "/orders/goPcPurchaseProduct",
                "title": "menu.orders.goPcPurchaseProduct",
                "name": "品牌商品采购",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__PCBrandProductPurchase' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/PCBrandProductPurchase'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/pc",
            "title": "商城运营",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/pc/column",
                "name": "自定义首页栏目",
                "title": "menu.pc.column",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__PcColumn__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/PcColumn/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/pc/column/form",
                "name": "添加自定义首页栏目",
                "title": "menu.pc.column.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__PcColumn__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/PcColumn/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/pc/column/edit_form/:id",
                "name": "添加自定义首页栏目",
                "title": "menu.pc.column.edit_form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__PcColumn__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/PcColumn/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/pc/customPage",
                "name": "自定义页面",
                "title": "menu.pc.customPage",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CustomPage' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CustomPage'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/pc/customPage/form/:id?",
                "name": "自定义页面",
                "title": "menu.pc.customPage.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__CustomPage__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/CustomPage/Form'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/product",
            "title": "menu.product",
            "hideBreadcrumb": true,
            "redirectUrl": "/product/manager",
            "routes": [
              {
                "path": "/product/category",
                "title": "menu.product.category",
                "name": "商品分类",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Category' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Category'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/manager",
                "title": "menu.product.manager",
                "name": "商品列表",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Manager' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Manager'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/manager/form/:id?",
                "name": "商品表单",
                "title": "menu.product.manager.form",
                "edit_title": "menu.product.manager.form_edit",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Manager__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Manager/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/manager/view/:id",
                "name": "查看商品",
                "title": "menu.product.manager.view",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Manager__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Manager/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/miniprogram",
                "title": "menu.product.miniprogram",
                "miniprogram": true,
                "name": "小程序商品列表",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Miniprogram' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Miniprogram'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/miniprogram/form/:id?",
                "name": "小程序商品表单",
                "title": "menu.product.miniprogram.form",
                "edit_title": "menu.product.miniprogram.form_edit",
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Manager__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Manager/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/miniprogram/view/:id",
                "name": "查看小程序商品",
                "title": "menu.product.miniprogram.view",
                "notShelves": true,
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Manager__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Manager/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/supply",
                "name": "供货商品",
                "title": "menu.product.supply",
                "notShelves": true,
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Supply' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Supply'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/supply/form/:id?",
                "name": "供货商品表单",
                "title": "menu.product.supply.form",
                "edit_title": "menu.product.supply.form_edit",
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Supply__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Supply/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/supply/view/:id",
                "name": "查看商品",
                "title": "menu.product.supply.view",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Supply__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Supply/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/supply/snapshot/:id",
                "name": "查看商品快照",
                "isSnapshot": true,
                "title": "menu.product.supply.snapshot",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Supply__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Supply/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/distribution",
                "name": "分销商品",
                "title": "menu.product.distribution",
                "notShelves": true,
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Distribution' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Distribution'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/distribution/form/:id?",
                "name": "分销商品表单",
                "title": "menu.product.distribution.form",
                "edit_title": "menu.product.distribution.form_edit",
                "miniprogram": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Distribution__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Distribution/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/distribution/view/:id",
                "name": "查看商品",
                "title": "menu.product.distribution.view",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Distribution__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Distribution/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/distribution/snapshot/:id",
                "name": "查看商品快照",
                "isSnapshot": true,
                "title": "menu.product.distribution.snapshot",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Distribution__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Distribution/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/groups",
                "name": "商品分组管理",
                "title": "menu.product.groups",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Groups' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Groups'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/propertyKey",
                "name": "商品属性",
                "title": "menu.product.property",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Property' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Property'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/paramsKey",
                "title": "menu.product.params",
                "name": "商品参数",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Params' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Params'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/brand",
                "title": "menu.product.brand",
                "name": "商品品牌",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Brand' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Brand'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/merchantSelfGoods",
                "title": "menu.product.merchantSelfGoods",
                "name": "商品列表",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__MerchantSelfGoods' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/MerchantSelfGoods'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/product/merchantSelfGoods/view/:id",
                "name": "查看商品",
                "title": "menu.product.merchantSelfGoods.view",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__MerchantSelfGoods__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/MerchantSelfGoods/View'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/service",
            "title": "menu.service",
            "routes": [
              {
                "path": "/service",
                "name": "服务管理",
                "title": "menu.service",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Service' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Service'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/service/form/:id?",
                "name": "服务表单",
                "title": "menu.service.form",
                "edit_title": "menu.service.form_edit",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Service__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Service/Form'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/stored-values",
            "title": "menu.storedValues",
            "routes": [
              {
                "path": "/stored-values",
                "name": "储值管理",
                "title": "menu.storedValues",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__StoredValue' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/StoredValue'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/stored-values/form/:id?",
                "name": "储值表单",
                "title": "menu.storedValues.form",
                "edit_title": "menu.storedValues.form_edit",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__StoredValue__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/StoredValue/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/stored-values/:id",
                "name": "储值详情",
                "title": "menu.storedValues.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__StoredValue__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/StoredValue/Detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/shareMarketing",
            "title": "供货管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/shareMarketing/supplyCategory",
                "name": "运营类目列表",
                "title": "menu.shareMarketing.supplyCategory",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__DisplayCategory' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/DisplayCategory'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/shareMarketing/productList",
                "name": "供货商品审核",
                "title": "menu.shareMarketing.productList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Share' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Share'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/shareMarketing/productDetail/:id",
                "name": "供货商品详情",
                "title": "menu.shareMarketing.productDetail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Product__Share__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Product/Share/View'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/shareMarketing/distributionOrder",
                "name": "分销订单",
                "title": "menu.shareMarketing.distributionOrder",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__DistributionOrder__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/DistributionOrder/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/shareMarketing/distributionOrder/detail/:id",
                "name": "分销订单详情",
                "title": "menu.shareMarketing.distributionOrder",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__DistributionOrder__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/DistributionOrder/Detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/system",
            "title": "系统管理",
            "hideBreadcrumb": true,
            "routes": [
              {
                "path": "/system/sms",
                "name": "短信管理",
                "title": "menu.system.sms",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Sms' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Sms'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/platform",
                "name": "平台信息",
                "title": "menu.system.platform",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Platform__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Platform/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/deploy",
                "name": "系统配置",
                "title": "menu.system.deploy",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__SystemDeploy__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/SystemDeploy/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/dept",
                "name": "机构管理",
                "title": "menu.system.dept",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Dept__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Dept/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/dept/add/:id?",
                "name": "机构编辑",
                "title": "menu.system.dept.add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Dept__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Dept/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/dept/detail/:id",
                "name": "机构修改",
                "title": "menu.system.dept.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Dept__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Dept/Detail'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/user",
                "name": "用户管理",
                "title": "menu.system.user",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__User__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/User/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/user/add",
                "name": "添加用户",
                "title": "menu.system.user.add",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__User__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/User/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/user/edit/:id",
                "name": "修改用户",
                "title": "menu.system.user.edit",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__User__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/User/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/user/detail/:id",
                "name": "用户详情",
                "title": "menu.system.user.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__User__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/User/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/menu",
                "name": "菜单管理",
                "title": "menu.system.menu",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Menu__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Menu/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/menu/form/:id?",
                "name": "菜单编辑",
                "title": "menu.system.menu.form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Menu__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Menu/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/menu/detail/:id",
                "name": "菜单详情",
                "title": "menu.system.menu.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__Menu__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/Menu/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/miniDeploy",
                "name": "小程序配置",
                "title": "menu.system.miniDeploy",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__MiniDeploy__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/MiniDeploy/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/receiptPrinter",
                "name": "小票打印机",
                "title": "menu.system.receiptPrinter",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__ReceiptPrinter__List' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/ReceiptPrinter/List'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/mallConfig",
                "name": "PC商城配置",
                "title": "menu.system.mallConfig",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__MallConfig__Form' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/MallConfig/Form'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/domainName",
                "name": "域名管理",
                "title": "menu.system.domainName",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__DomainName' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/DomainName'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/official-accounts",
                "name": "公众号配置",
                "title": "menu.system.officialAccounts",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__OfficialAccounts' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/OfficialAccounts'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/system/message-notification",
                "name": "消息通知",
                "title": "menu.system.messageNotification",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__System__MessageNotification' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/System/MessageNotification'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/order",
            "name": "订单管理",
            "title": "order",
            "routes": [
              {
                "path": "/order",
                "name": "订单管理",
                "title": "menu.order",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/order/:id",
                "name": "订单详情",
                "title": "menu.order.detail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__Order__Detail' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/Order/Detail'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "path": "/view",
            "title": "menu.view",
            "hideBreadcrumb": true,
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__View' */'/Users/atzcl/react/zaiwuxian/saas-manager/src/pages/View'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
