import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const userPrefix = {
  prefix: `${prefix}`,
};

// 获取子账号信息详情
export const getUserInfo = async (id: string) => Request.get(`/info?id=${id}`, { ...userPrefix });

// 修改子账号信息
export const updateUserInfo = async (data: object) =>
  Request.post('/update', { ...userPrefix, data });

// 修改子账号密码
export const updateSonPassword = async (data: object) =>
  Request.post('/update-password', { ...userPrefix, data });

// 修改主账号密码
export const updatePassword = async (data: object) =>
  Request.post('/zwx-system/tenant/updatePassword', { data });
