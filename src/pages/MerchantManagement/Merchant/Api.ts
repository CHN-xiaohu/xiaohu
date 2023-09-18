import { Request } from '@/foundations/Request';

export type IMerchantManagementColumns = {
  id: string;
  createTime: string; //  开通时间
  updateTime: string; // 截止时间
  domain: string; // 商户域名
  tenantName: string; // 商户名称
  linkman: string; // 联系人
  contactNumber: string; // 联系手机
  versionType: number; // 版本类型（0 企业版、1 门店版、2渠道版）
  mainCategory: string; // 主营类目
  tenantAccount: string; // 商户账号
};

// 商户管理-列表
export const getMerchantManagement = async (params: any) =>
  Request.get('/zwx-system/tenant/getMerchantManagement', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IMerchantManagementColumns[]>;
