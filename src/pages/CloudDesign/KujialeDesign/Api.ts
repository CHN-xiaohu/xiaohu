import { Request } from '@/foundations/Request';

// 获取单点登录token
export const getToken = async (params: AnyObject) =>
  Request.get<string>('/zwx-kujiale/account/token', { params });

export const syncDesign = () => Request.get('/zwx-kujiale/design/syncDesignData');
