export const advStatus = ['', '未生效', '生效中', '已过期'];
export const showLocation = (type: any) => {
  const theLocation = {
    APP_FIRST_SCREEN: '首页弹窗广告',
    APP_SPLASH_SCREEN: '闪屏广告',
    MINI_FIRST_BANNER: '首页banner',
    MINI_FIRST_RECOMMEND: '首页推荐专区',
    MINI_OWNER_PAGE: '首页广告位',
  };
  return theLocation[type];
};

export const skipLocation = (type: any) => {
  const advPlace = {
    APP_SPECIAL_PAGE: '城市专场首页',
    APP_PEAS_PAGE: '咋豆充值页面',
    APP_PRODUCT_DETAIL: '商品详情页',
    APP_EXTERNAL: '外部跳转',
    APP_STORE_VIP: '商家VIP页',
    MINI_PRODUCT_DETAIL: '小程序商品详情',
    MINI_SPECIAL_PAGE: '小程序专题',
    MINI_COUPON_PAGE: '小程序优惠券',
    GROUP_PURCHASE_PAGE: '团购活动',
    SCHEME_TAG_SEARCH: '方案标签搜索',
    SPECIFY_CATEGORY: '指定分类',
    SPECIFY_LABEL: '指定标签',
  };
  return advPlace[type];
};
