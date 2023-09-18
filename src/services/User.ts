/*
+---------------------------------------------------------------------------------------------------
|
+---------------------------------------------------------------------------------------------------
| 用户登录辅助
|
*/

import { history } from 'umi';

import { BaseCacheHelp } from './Cache';

// 获取用户身份标识
export class UserAuthTokenCache extends BaseCacheHelp {
  static readonly key = 'zazfix_login_token';
}

// 当前用户的权限角色
export class UserAuthorityCache extends BaseCacheHelp {
  static readonly key = 'zazfix_authority';
}

export class UserAuthorityRoutesCache extends BaseCacheHelp {
  static readonly key = 'zazfix_routes';
}

// 按钮权限
export class UserButtonsAuthorityCache extends BaseCacheHelp {
  static readonly key = 'zazfix_buttons';
}

// 因为没有接口获取用户信息，所以只能在登录的时候保存到缓存里面
export class UserInfoCache extends BaseCacheHelp {
  static readonly key = 'zazfix_current-user';
}

export const removeAllUserCache = () => {
  UserAuthTokenCache.remove();
  UserAuthorityCache.remove();
  UserButtonsAuthorityCache.remove();
  UserInfoCache.remove();
  UserAuthorityRoutesCache.remove();
};

// 退出登录
export const logout = () => {
  // 清空所有缓存信息
  removeAllUserCache();

  // 跳转到登录页面
  history.replace('/users/login');
};
