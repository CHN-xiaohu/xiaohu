/*
+-----------------------------------------------------------------------------------------------------------------------
| Author: atzcl <atzcl0310@gmail.com>  https://github.com/atzcl
+-----------------------------------------------------------------------------------------------------------------------
| 会员相关
|
*/

import { stringify } from 'qs';
import { Request } from '@/foundations/Request';

export type LoginSuccessInfo = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  sys_account_user_id: string;
  user_name: string;
  real_name: string;
  avatar: string;
  client_type: string;
  client_id: string;
  role_name: string;
  license: string;
  user_type: string;
  user_id: string;
  role_id: string;
  nick_name: string;
  has_vip: number;
  is_sub_account: string;
  dept_id: string;
  account: string;
  tenant_code: string;
  jti: string;
  source: string;
};

export async function accountLogin(params: any) {
  const { tenant_code, grant_type, ...lastParams } = params;

  return Request.post('/zwx-auth/oauth/token', {
    headers: {
      'Tenant-Code': tenant_code || window.injectionGlobalDataSource.code,
      'Client-Type': 'WEB',
      // 'User-Type': is_sub_account === 'NO' ? 'STORE' : 'BRAND_STORE',
      'User-Type': 'BRAND_STORE',
      Authorization: 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    notAutoHandleResponse: true,
    body: stringify({
      ...lastParams,
      grant_type: grant_type ?? 'password',
      scope: 'all',
      type: 'account',
    }),
  });
}

// 根据子域名查询租户（品牌商）信息
export const getQueryTenant = async (params: { domain: string }) =>
  Request.get('/zwx-system/tenant/map', { params });
