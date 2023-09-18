import { Request } from '@/foundations/Request';

export type SupplyProductColumns = {
  [x: string]: any;
  id: string;
  createTime: string;
  updateUser: string;
  status: number;
  cnName: string;
  enName: string;
  image: string;
  serial: number;
  categorys: { id: string }[];
  categoryIds: any;
};

const prefix = '/zwx-product/productinfo/share';

// 分页列表
export const getSupplyProducts = async (params: any) =>
  Request.get('/productPage', {
    prefix,
    params,
  }) as PromiseResponsePaginateResult<SupplyProductColumns>;

export const getSupplyProduct = async (id: string) =>
  Request.get<SupplyProductColumns>(`/detail/${id}`, { prefix });

export const getSupplyProductSnapshot = async (id: string) =>
  Request.get<SupplyProductColumns>(`/zwx-product/productinfo/share/snapshot/${id}`);

// 批量上下架
export const batchUpdateSupplyProductState = async (data: { ids: string[]; productState: 1 | 2 }) =>
  Request.post('/batchUpdateState', { prefix, data });

// 提交审核
export const submitSupplyProductReview = async (id: string) =>
  Request.post(`/zwx-product/shareproductaudit/submitAudit/${id}`);

export const fromProductCopyToSupplyProduct = async (id: string) =>
  Request.get(`/copy/${id}`, { prefix });

export const fromMiniProductCopyToSupplyProduct = async (id: string) =>
  Request.get(`/miniCopy/${id}`, { prefix });

// 新增或者是编辑供货商品
export const addOrUpdateSupplyProduct = async (data: any) =>
  Request.post('/save', { prefix, data });

// ===================== 审核记录 ===========================
export type AuditRecordColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  productInfoName: string;
  category1Id: string;
  category2Id: string;
  category3Id: string;
  brandId: string;
  image: string;
  minSupplyPrice: number;
  maxSupplyPrice: number;
  minSuggestSalePrice: number;
  maxSuggestSalePrice: number;
  productInfoId: number;
  poolProductInfoId: number;
  auditContent: string;
  auditUser: number;
  auditUserName: string;
  auditTime: string;
  shareVersion: number;
  categoryNamePath: string;
};

export const getAuditRecords = async (params: AnyObject) =>
  Request.get('/zwx-product/shareproductaudit/selectAuditPage', {
    params,
  }) as PromiseResponsePaginateResult<SupplyProductColumns>;
