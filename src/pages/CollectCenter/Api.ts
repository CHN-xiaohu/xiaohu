import { Request } from '@/foundations/Request';

const prefix = '/zwx-product';

const marketingFix = '/zwx-marketing';

const cProduct = {
  prefix: `${prefix}/productinfo/share`,
};

const treeFix = {
  prefix: `${marketingFix}/shareMarketingCategory`,
};

export const getCProduceList = async (params: any) =>
  Request.get('/poolPage', { ...cProduct, params });

export const getTreeList = async () => Request.get('/list', { ...treeFix });

export type IMyApplicationRecordListColumns = {
  tenantName: string; // 供货商名称
  auditStatus: number; // 审核状态
  refuseReason: string; // 审核说明
  applyTime: string; // 申请时间
  auditTime: string; // 审核时间
};

// 我的申请
export const getMyApplicationRecordList = async (params: any) =>
  Request.get('/zwx-product/shareProductAuthority/myApplicationRecordList', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IMyApplicationRecordListColumns[]>;

// 渠道分销商品
export const getMyApplicationRecordListEx = async (params: any) =>
  Request.get('/zwx-product/shareProductAuthority/myApplicationRecordListEx', {
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<IMyApplicationRecordListColumns[]>;
