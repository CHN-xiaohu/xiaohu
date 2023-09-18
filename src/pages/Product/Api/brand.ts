import { Request } from '@/foundations/Request';

export type BrandColumns = {
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

const prefix = '/zwx-product/productbrand';

// 分页列表
export const getBrandList = async (params: any) =>
  Request.get('/page', { prefix, params }) as PromiseResponsePaginateResult<BrandColumns>;

// 新增/修改品牌
export const editBrand = async (data: any) => Request.post<BrandColumns>('/save', { prefix, data });

// 修改品牌状态
export const updateBrandStatus = (data: any) =>
  Request.post<BrandColumns>('/updateStatus', { prefix, data });

// 根据分类 id 查找品牌数据
export const getBrandsByCategoryId = async (params: any) =>
  Request.get<BrandColumns>('/list', { prefix, params });
