import { enumToTree } from '@/pages/Programa/Utils';

export const ADV_TEMPLATE_CODE = {
  ADVERT_TEMPLATE_ONE: '模板一（带标题）',
  ADVERT_TEMPLATE_TWO: '模板二（带标题）',
  ADVERT_TEMPLATE_THREE: '模板三（带标题）',
  ADVERT_TEMPLATE_FOUR: '模板四（轮播）',
  ADVERT_TEMPLATE_FIVE: '模板五（单图）',
  ADVERT_TEMPLATE_SIX: '模板六（一行两个）',
  ADVERT_TEMPLATE_SEVEN: '模板七（一行三个）',
  ADVERT_TEMPLATE_EIGHT: '模板八（大图横向滑动）',
};

export const TemplateWithArray = ['ADVERT_TEMPLATE_FOUR', 'ADVERT_TEMPLATE_EIGHT'];

export const ADV_TEMPLATE_SIZE = {
  ADVERT_TEMPLATE_ONE: {
    default: 3,
    rule: [
      {
        maxImageWidth: 350,
        maxImageHeight: 350,
      },
      {
        maxImageWidth: 350,
        maxImageHeight: 170,
      },
      {
        maxImageWidth: 350,
        maxImageHeight: 170,
      },
    ],
  },
  ADVERT_TEMPLATE_TWO: {
    default: 4,
    rule: Array(4).fill({
      maxImageWidth: 350,
      maxImageHeight: 170,
    }),
  },
  ADVERT_TEMPLATE_THREE: {
    default: 3,
    rule: [
      {
        maxImageWidth: 710,
        maxImageHeight: 350,
      },
      {
        maxImageWidth: 350,
        maxImageHeight: 170,
      },
      {
        maxImageWidth: 350,
        maxImageHeight: 170,
      },
    ],
  },
  ADVERT_TEMPLATE_FOUR: {
    default: 1,
    rule: [
      {
        maxImageWidth: 750,
        maxImageHeight: 360,
      },
    ],
  },
  ADVERT_TEMPLATE_FIVE: {
    default: 1,
    rule: [
      {
        maxImageWidth: 710,
        maxImageHeight: 200,
      },
    ],
  },
  ADVERT_TEMPLATE_SIX: {
    default: 2,
    rule: Array(2).fill({
      maxImageWidth: 350,
      maxImageHeight: 170,
    }),
  },
  ADVERT_TEMPLATE_SEVEN: {
    default: 3,
    rule: Array(3).fill({
      maxImageWidth: 226,
      maxImageHeight: 200,
    }),
  },
  ADVERT_TEMPLATE_EIGHT: {
    default: 1,
    rule: [
      {
        maxImageWidth: 680,
        maxImageHeight: 192,
      },
    ],
  },
  NAVIGATION_TEMPLATE_ONE: {
    default: 1,
  },
};

export const PRODUCT_TEMPLATE_CODE = {
  PRODUCT_TEMPLATE_ONE: '模板一（带标题）',
  PRODUCT_TEMPLATE_TWO: '模板二（大图横向滑动）',
  PRODUCT_TEMPLATE_THREE: '模板三（一行两个）',
};

export const NAVIGATION_TEMPLATE_CODE = {
  NAVIGATION_TEMPLATE_ONE: '模板一（图文导航）',
};

export const CATEGORY_TEMPLATE_CODE = {
  CATEGORY_TEMPLATE_ONE: '模板一',
};

export const PROMOTION_TEMPLATE_CODE = {
  PROMOTION_TEMPLATE_ONE: '模板一',
};

export const ACTION_TYPE = {
  PEAS_RECHARGE_PAGE: '咋豆充值',
  PRODUCT_DETAIL_PAGE: '商品详情页',
  STORE_VIP_PAGE: '商家VIP',
  EXTERNAL_SKIP_PAGE: '外部跳转',
  CATEGORY_PAGE: '指定分类',
  // SPECIAL_TOPIC_PAGE: '指定专题',
  // SPECIAL_TOPIC_PAGE_LIST_PAGE: '专题列表',
  SPECIAL_TOPIC_PAGE_WHOLE_PAGE: '全部分类',
  // OFTEN_SHOP_PAGE: '常购清单',
  SALES_ORDER_PAGE: '采购订单',
  GROUP_PURCHASE_PAGE: '团购详情页',
  COUPON_PAGE: '领券中心',
  DESIGN_LIST: '3D方案列表',
  DESIGN_DETAIL: '方案详情页',
  ACTION_PAGE: '活动页',
  PRODUCT_GROUP: '商品分组',
  DISTRIBUTOR_CENTER: '分销员中心',
  SCHEME_TAG_SEARCH: '方案标签搜索',
  // SAMPLE_ORDER_PAGE: '样品订单',
};

export const COLUMN_TYPE = {
  ADVERT_TEMPLATE: '广告栏目',
  PRODUCT_TEMPLATE: '商品栏目',
  NAVIGATION_TEMPLATE: '导航栏目',
  CATEGORY_TEMPLATE: '分类栏目',
  // 活动暂时不做
  // PROMOTION_TEMPLATE: '促销栏目',
};

export const TemplateSelectTree = {
  ADVERT_TEMPLATE: enumToTree(ADV_TEMPLATE_CODE),
  PRODUCT_TEMPLATE: enumToTree(PRODUCT_TEMPLATE_CODE),
  NAVIGATION_TEMPLATE: enumToTree(NAVIGATION_TEMPLATE_CODE),
  CATEGORY_TEMPLATE: enumToTree(CATEGORY_TEMPLATE_CODE),
  PROMOTION_TEMPLATE: enumToTree(PROMOTION_TEMPLATE_CODE),
  ACTION_TYPE: enumToTree(ACTION_TYPE),
  COLUMN_TYPE: enumToTree(COLUMN_TYPE),
};

export type ActionType = keyof typeof ACTION_TYPE;
export type ColumnType = keyof typeof COLUMN_TYPE;
export type TemplateCodeType =
  | keyof typeof ADV_TEMPLATE_CODE
  | keyof typeof PROMOTION_TEMPLATE_CODE
  | keyof typeof PRODUCT_TEMPLATE_CODE
  | keyof typeof CATEGORY_TEMPLATE_CODE
  | keyof typeof NAVIGATION_TEMPLATE_CODE;
