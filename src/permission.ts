import { UserAuthTokenCache } from '@/services/User';
// import { getUser } from '@/pages/User/Api';

const homePagePath = '/';
// 登录页面路径
const loginPagePath = '/users/login';
// 鉴权白名单, 值是路由 path
const whiteList = [loginPagePath];

/**
 * 组件权限检查方法
 *
 * @param {string[]} authority
 * @param {string | string[]} currentAuthority 当前用户的角色
 * @param {React.ReactNode} target 权限校验通过后渲染的组件
 * @param {React.ReactNode | null} Exception 权限校验失败后渲染的组件
 */
// export const checkComponentPermissions = <T, K>(
//   authority: string[],
//   currentAuthority: string | string[],
//   target: T,
//   Exception: K,
// ): T | K => ({} as any);

// /**
//  * 通用校验
//  */
// export const checkPermissions = () =>
//   new Promise((resolve, reject) => {
//     // 待实现
//     resolve();
//   });

/**
 * 鉴权
 */
export const check = async (pathname: string, currentUserInfo = {}): Promise<string> => {
  // 需要跳转的页面
  let jumpPath = '';

  // 获取用户身份标识
  const token = UserAuthTokenCache.get();

  // 只需要处理有没 token 就好了
  if (token) {
    // 已登录，并且跳转的是登录页
    if (pathname === loginPagePath) {
      // 那么就跳转到首页去
      jumpPath = homePagePath;
    } else if (!Object.keys(currentUserInfo).length) {
      // 已登录且要跳转的页面不是登录页,那么就判断下是否已获取用户信息

      // 请求用户数据，并设置到全局状态中
      return window.$fastDispatch((model) => model.user.getUserInfo).then(() => pathname);
    }

    // 用户的身份数据已获取
    // todo: 权限处理待实现
  } else if (!whiteList.includes(pathname)) {
    // 判断前往的是否是白名单
    // 不存在就跳转去登录页面
    jumpPath = loginPagePath;
  }

  return jumpPath && jumpPath !== pathname ? jumpPath : '';
};
