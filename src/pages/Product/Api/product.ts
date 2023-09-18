import { Request } from '@/foundations/Request';

export type ProductColumns = {
  id: string;
  categoryNamePath: string;
  name: string;
  image: string;
  maxPurchasePrice: number;
  maxVipPurchasePrice: number;
  minPurchasePrice: number;
  minVipPurchasePrice: number;
  mini: number;
  productState: number;
  sample: number;
  shareProfit: number;
  chargeUnit: {
    chargeUnitName: string;
  };
  introductions: {
    id: string;
    content: string;
    contentAttribute?: string;
    contentType: number;
  }[];
};

const prefix = '/zwx-product/productinfo/purchase';

export const getProducts = async (params: any = {}) =>
  Request.get('/adminPage', { prefix, params }) as PromiseResponsePaginateResult<ProductColumns>;

export const getProduct = async (id: string) => Request.get(`/detail/${id}`, { prefix });

export const addOrUpdateProduct = async (data: any) => Request.post('/save', { prefix, data });

export const delProduct = async (id: string) => Request.delete(`/delete/${id}`, { prefix });

// 上下架
export const updateProductState = async (data: { id: string; productState: 1 | 2 }) =>
  Request.post('/updateState', { prefix, data });

export const batchUpdateProductState = async (data: { ids: string[]; productState: 1 | 2 }) =>
  Request.post('/batchUpdateState', { prefix, data });

// ===================== 小程序商品 ===========================
export type MiniprogramProductColumns = {
  minSalePrice?: number;
  maxSalePrice?: number;
  minOrignPrice?: number;
  maxOrignPrice?: number;
  productType?: number;
} & ProductColumns;

export const getMiniprogramProducts = async (params: any = {}) =>
  Request.get('/zwx-product/productinfo/mini/adminPage', {
    params,
  }) as PromiseResponsePaginateResult<ProductColumns>;

export const getSelectMiniprogramProducts = async (params: any = {}) =>
  Request.get('/zwx-product/productinfo/mini/platform', {
    params,
  }) as PromiseResponsePaginateResult<ProductColumns>;

export const getMiniprogramProduct = async (id: string) =>
  Request.get(`/zwx-product/productinfo/mini/detail/${id}`);

// 上下架
export const updateMiniprogramProductState = async (data: {
  id: string;
  miniProductState: 1 | 2;
}) => Request.post('/zwx-product/productinfo/mini/updateState', { data });

// 批量上下架
export const batchUpdateMiniprogramProductState = async (data: {
  ids: string[];
  miniProductState: 1 | 2;
}) => Request.post('/zwx-product/productinfo/mini/batchUpdateState', { data });

export const addOrUpdateMiniprogramProduct = async (data: any) =>
  Request.post('/zwx-product/productinfo/mini/save', { data });

export const getMiniprogramProductQR = async (id: string) =>
  Request.post('/zwx-product/wxQrScene/getQr', {
    data: {
      path: `pages/Product/Detail/index?id=${id}`,
      // scene: JSON.stringify({ id })
    },
    notAutoHandleResponse: true,
    getResponse: true,
    headers: {
      Accept: '*/*',
    },
  }).then(async (res: any) => {
    const blob = await res.response.clone().blob();
    console.log(blob?.type);
    return blob?.type ? (window.URL || window.webkitURL).createObjectURL(blob) : '';
  });

// ===================== 计价单位 ===========================
export type ChargeTreeColumns = {
  id: string;
  name: string;
  children: ChargeTreeColumns[];
};

export const chargeTree = () => Request.get<ChargeTreeColumns[]>('/zwx-product/charge/tree');

// ===================== 商品日志 ===========================
export type ProductLogColumns = {
  createTime: string;
  createUser: number;
  createUsername: string;
  hasSnapshot: number;
  id: string;
  optType: number;
  optTypeStr: string;
  productInfoId: string;
  remark: string;
  userName: string;
  userType: number;
};

export const getProductLogs = (params: AnyObject) =>
  Request.get('/zwx-product/productoptlog/page', {
    params,
  }) as PromiseResponsePaginateResult<ProductLogColumns>;

// ===================== 品牌选品 ====================

// 未上架商品
export const getBrandProductNotSelf = (params: any) =>
  Request.get('/belongNotShelf', { prefix, params });

// 已上架商品
export const getBrandProductSelf = (params: any) =>
  Request.get('/zwx-product/productinfo/purchase/belongShelf', { params });

// 复制商品到小程序
export const copyProductToMiniProgram = (data: any) =>
  Request.post('/zwx-product/productinfo/mini/putShelf', { data, showSuccessMessage: false });

// 查询租户所属渠道的PC默认域名
export const getBelongFirstDefaultDomain = (tenantCode: string) =>
  Request.get(
    `/zwx-system/sysTenantDomainSetting/getBelongFirstDefaultDomain?tenantCode=${tenantCode}`,
  );

export type TenantCodeUserColumns = {
  belongChannel: string;
  versionType: number;
};

// 查询租户号对于信息
export const getBelongChannel = (tenantCode: string) =>
  Request.get(`/zwx-system/tenant/getByTenantCode?tenantCode=${tenantCode}`);
