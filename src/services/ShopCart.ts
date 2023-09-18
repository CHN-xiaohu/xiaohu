/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 用户登录辅助
|
*/

import { history } from 'umi';

import { BaseCacheHelp } from './Cache';

export class ShopCartCache extends BaseCacheHelp {
  static readonly key = 'zazfix_current-shopCart';
}

export class ShopCartSkuPanelCache extends BaseCacheHelp {
  static readonly key = 'zazfix_current-shopCartSkuPanel';
}

export const removeAllUserCache = () => {
  ShopCartCache.remove();
  ShopCartSkuPanelCache.remove();
};

// 退出登录
export const logout = () => {
  // 清空所有缓存信息
  removeAllUserCache();

  // 跳转到登录页面
  history.replace('/users/login');
};
