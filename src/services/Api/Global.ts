import { stringify } from 'qs';
import { Request } from '@/foundations/Request';

export async function accountLogin(params: any) {
  params.tenant_code = params.tenantCode;
  delete params.tenantCode;

  // 临时这样切换子账号
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const is_sub_account = window.localStorage.getItem('is_sub_account') || 'NO';

  const body = stringify({ ...params, grantType: 'password', scope: 'all', is_sub_account });

  return Request.post('/zwx-auth/oauth/token', {
    headers: {
      'Tenant-Code': params.tenant_code,
      'Client-Type': 'WEB',
      // 'User-Type': is_sub_account === 'NO' ? 'STORE' : 'BRAND_STORE',
      'User-Type': 'BRAND_STORE',
      Authorization: 'Basic c3dvcmQ6c3dvcmRfc2VjcmV0',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    notAutoHandleResponse: true,
    body,
  });
}

// =====================菜单===========================

export async function getTopMenus(params: any) {
  return Request.get('/zwx-system/menu/top-menu', { params });
}

export async function getRoutes(params: any) {
  return Request.get('/zwx-system/menu/routes', { params });
}

export type AuthButtonsColumns = {
  id: string;
  parentId: string;
  code: string;
  name: string;
  alias: string;
  path: string;
  source: string;
  sort: number;
  category: number;
  action: number;
  isOpen: number;
  remark: string;
  isDeleted: number;
  children: AuthButtonsColumns[];
  parentName: string;
  categoryName: string;
  actionName: string;
  isOpenName: string;
  hasChildren: false;
};

export async function getAuthButtons() {
  return Request.get('/zwx-system/menu/buttons');
}

export async function getAuthRoutes() {
  return Request.get('/zwx-system/menu/auth-routes');
}

export async function grantTree(params?: any) {
  return Request.get(`/zwx-system/menu/grant-tree`, { params });
}

// ===================== 更新当前登录品牌商的 saas mall 站点配置 ===========================
const updateSaaSMallSiteSettingApi =
  process.env.NODE_ENV === 'development'
    ? 'http://127.0.0.1:3000'
    : // 如：https://server-api-development.zazfix.com
      `https://server-api-${process.env.APP_NODE_ENV}.mall${
        process.env.APP_NODE_ENV === 'development' ? '-dev' : ''
      }.zazfix.com`;
export const updateSaaSMallSiteSettings = () =>
  Request.post(`${updateSaaSMallSiteSettingApi}/api/update-site-settings`, {
    showErrorMessage: true,
    showSuccessMessage: false,
  });
