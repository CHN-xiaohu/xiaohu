import { enumToTree } from '@/pages/Programa/Utils';

export const COLUMN_TYPE = {
  ADVERT_TEMPLATE: '广告栏目',
  PRODUCT_TEMPLATE: '商品栏目',
  NAVIGATION_TEMPLATE: '导航栏目',
};

export const COLUMN_PRODUCT_TYPE = {
  PC_PRODUCT_TEMPLATE_ONE: '简洁列表',
  PC_PRODUCT_TEMPLATE_TWO: '左一右八',
  PC_PRODUCT_TEMPLATE_THREE: '左右滑动',
  PC_PRODUCT_TEMPLATE_FOUR: '左一右九',
  PC_PRODUCT_TEMPLATE_FIVE: '带分类商品列表',
};

export const COLUMN_IMAGE_SHOW = {
  PC_PRODUCT_TEMPLATE_ONE:
    'https://static.zazfix.com/web/images/2020-07-30/1lP44u2Y0HrV671OVP59.png',
  PC_PRODUCT_TEMPLATE_TWO:
    'https://static.zazfix.com/web/images/2020-07-30/QjT203N0S3dv730K9k1v.png',
  PC_PRODUCT_TEMPLATE_THREE:
    'https://static.zazfix.com/web/images/2020-07-30/T88wI42N2cg1aHAjgk6F.png',
  PC_PRODUCT_TEMPLATE_FOUR:
    'https://static.zazfix.com/web/images/2020-07-30/yz7xmg1io4N93QO1XgW1.png',
  PC_PRODUCT_TEMPLATE_FIVE:
    'https://static.zazfix.com/web/images/2020-07-30/F5NZinnyplfuI9Ghx01H.png',
  PC_NAVIGATION_TEMPLATE_ONE:
    'https://static.zazfix.com/web/images/2020-07-30/U7F7eqi83izSvzDtNI63.png',
  PC_ADVERT_TEMPLATE_ONE:
    'https://static.zazfix.com/web/images/2020-07-30/H0IK9Mj6U9dWxN27A8cU.png',
  PC_ADVERT_TEMPLATE_TWO:
    'https://static.zazfix.com/web/images/2020-07-30/H0IK9Mj6U9dWxN27A8cU.png',
};

export const COLUMN_NAVIGATION = {
  PC_NAVIGATION_TEMPLATE_ONE: '导航模板一',
};

export const COLUMN_ADV = {
  PC_ADVERT_TEMPLATE_ONE: '轮播广告',
  PC_ADVERT_TEMPLATE_TWO: '横向全屏广告',
};

export const modelNamespace = 'pcColumn' as 'pcColumn';

export const SKIP_TYPE = {
  PC_FIRST_PAGE: '首页',
  PC_SPECIAL_CATEGORY: '指定分类',
  PC_SELF_DEFINE_PAGE: '自定义页面',
  PC_DESIGN: '我要设计',
  PC_PRODUCT_DETAIL: '商品详情页',
  PC_3D_DESIGN: '3D设计方案',
  EXTERNAL_SKIP_PAGE: '外部跳转',
};

export const PC_SKIP_VALUE_SHOW = {
  PC_SELF_DEFINE_PAGE: 'selfDefineName',
  PC_SPECIAL_CATEGORY: 'treeNamePath',
  PC_PRODUCT_DETAIL: 'productName',
  EXTERNAL_SKIP_PAGE: 'actionValue',
};

export const PC_SKIP_ACTION_TYPE = {
  PC_SELF_DEFINE_PAGE: 'selfDefinePage',
  PC_SPECIAL_CATEGORY: 'categoryPathId',
};

export const TemplateSelectTree = {
  COLUMN_TYPE: enumToTree(COLUMN_TYPE),
  COLUMN_NAVIGATION: enumToTree(COLUMN_NAVIGATION),
  SKIP_TYPE: enumToTree(SKIP_TYPE),
  COLUMN_ADV: enumToTree(COLUMN_ADV),
  COLUMN_PRODUCT_TYPE: enumToTree(COLUMN_PRODUCT_TYPE),
};
