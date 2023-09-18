import { Request } from '@/foundations/Request';

export type cellectColumn = {
  distributionId: string;
  paramVals: string[];
  paramValIds: string[];
  salePropKeyIds: string[];
  salePropKeyNames: string[];
  paramPropKeyNames: string[];
  productInfo: {
    id: string;
    categoryNamePath: string;
    name: string;
    image: string;
    minSupplyPrice: number;
    maxSupplyPrice: number;
    minSuggestSalePrice: number;
    maxSuggestSalePrice: number;
    mini: number;
    productState: number;
    sample: number;
    shareProfit: number;
    minProfitMargin: number;
    maxProfitMargin: number;
    supplyId: string;
    supplyCode: string;
    supplyName: string;
    chargeUnit: {
      chargeUnitName: string;
    };
  };
  introductions: {
    id: string;
    content: string;
    contentAttribute?: string;
    contentType: number;
  }[];
  images: {
    url: string;
    productInfoId: string;
  }[];
  products: {
    productInfoId: string;
    image: string;
    salePropValIds: any;
    salePropValNames: string;
  }[];
  view: {
    isSelf: boolean; // 是否自己商品
    belongChannel: string; // 所属渠道（0 平台 品牌商id）
    isSelfApply: boolean; // 当前品牌商是否已申请分销
    isBelongApply: boolean; // 所属渠道品牌商是否已申请分销
    isBelongProduct: boolean; // 是否所属渠道品牌商自己的商品
    belongVersionType: number; // 所属渠道品牌商版本类型（0 企业版、1 门店版、2渠道版）
  };
};

const collectPrefix = {
  prefix: '/zwx-product/productinfo/share',
};

const distributePrefix = {
  prefix: '/zwx-product/productinfo/distribution',
};

// 获取采购商品详情
export const getCollectDetail = async (id: string) =>
  Request.get(`/poolDetail/${id}`, { ...collectPrefix });

// 添加到店铺或添加到仓库
export const addDistribute = async (data: object) =>
  Request.post('/distribute', { ...distributePrefix, data });

// 查询指定供应商的审核状态
export const getSelectDistributorReviewStatus = async (params: any) =>
  Request.get('/zwx-product/shareProductAuthority/selectDistributorReviewStatus', { params });

// 申请成为分销商
export const applyForDistributor = async (data: object) =>
  Request.post('/zwx-product/shareProductAuthority/applyForDistributor', { data });
