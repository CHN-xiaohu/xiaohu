/*
+-----------------------------------------------------------------------------------------------------------------------
|
+-----------------------------------------------------------------------------------------------------------------------
| 小程序用户管理
|
*/

import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const userPrefix = {
  prefix: `${prefix}/user-oauth`,
};

export type MiniUserColumn = {
  username: string;
  nickname: string;
  avatar: string;
  company: string;
  email: string;
  remark: string;
  phone: string;
};

export const getMiniUser = async (data: any) =>
  Request.post<MiniUserColumn>('/queryUsersOauthPage', {
    ...userPrefix,
    showSuccessMessage: false,
    data,
  });
