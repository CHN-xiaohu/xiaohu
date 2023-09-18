export const deviceType = ['', 'Android', 'IOS', 'IOS, Android'];

export const receiverType = ['全部用户', '指定商家'];

export const getBizType = (value: any) => {
  const bizType = {
    NEWS: '消息通知',
    PRODUCT_DETAIL: '商品详情页面',
    EXTERNAL_LINKS: '外部链接',
  }[value];
  return bizType;
};
