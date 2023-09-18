import { Request } from '@/foundations/Request';

export type IMyAuditDistributorListColumns = {
  id: number; // id
  tenantName: string; // 分销商名称
  auditStatus: number; // 审核状态
  refuseReason: string; // 审核不通过原因
  applyTime: string; // 申请时间
  auditTime: string; // 审核时间
  mainCategory: string; // 主营类目
};

// 供应商审核列表
export const getMyAuditDistributorList = async (params: any) =>
  Request.get('/zwx-product/shareProductAuthority/myAuditDistributorList', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IMyAuditDistributorListColumns[]>;

// 供应商批量审核
export const setBatchAuditDistributor = async (data: any) =>
  Request.post('/zwx-product/shareProductAuthority/batchAuditDistributor', { data });
