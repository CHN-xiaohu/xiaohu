// 拼接 admin 的路由
export const getAdminRoute = (suffix: string) =>
  `/admin${suffix ? `/${suffix.replace('/', '')}` : ''}`;
