import { Request } from '@/foundations/Request';

export type OfficiaAccountColumns = {
  id: string;
  appId: string;
  appSecret: string;
  qrCodeUrl: string;
};

// 公众号appid
// 密钥
// 小程序二维码

// 获取公众号配置
export const getOfficialAccount = () =>
  Request.get<OfficiaAccountColumns>('/zwx-system/wxOfficialAccountsSetting/getByTenantCode');

// 保存/更新 公众号配置
export const saveOrUpdateOfficialAccount = (data: any) =>
  Request.post('/zwx-system/wxOfficialAccountsSetting/saveOrUpdate', { data });
