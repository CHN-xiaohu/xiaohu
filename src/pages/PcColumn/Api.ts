import { Request } from '@/foundations/Request';

export type PcColumnColumns = {
  id: string;
  sort: string;
  name: number;
  type: number;
  createTime: string;
  minPrice: any;
  minPurchasePrice: any;
  maxPrice: any;
  maxVipPurchasePrice: any;
};

const prefix = '/zwx-marketing/column';

const pcPrefix = '/zwx-marketing/column/pc';

const contentFix = '/zwx-marketing/columnadvert/pc';

// 栏目列表查询
export const getColumnPage = async (params: { current: number }) =>
  Request.get('/page', { prefix, params });

// 栏目创建
export const addPcColumn = async (data: any) => Request.post('/save', { prefix: pcPrefix, data });

// 栏目商品查询
export const getColumnProduct = async (params: { current: number }) =>
  Request.get('/select', { prefix, params });

// 栏目内容新增
export const addPcColumnContent = async (data: any) =>
  Request.post('/save', { prefix: contentFix, data });

// 栏目详情
export const getPcColumnDetail = async (id: string) =>
  Request.get(`/detail/${id}`, { prefix: pcPrefix });

// 删除栏目
export const delPcColumn = async (id: string) => Request.delete(`/remove/${id}`, { prefix });

// 修改栏目
export const updatePcColumn = async (data: any) => Request.post('/update', { prefix, data });

// 获取全部自定义页面信息
export const getSelfDefinePage = async () => Request.get('/zwx-system/sysCustomerPage/selectList');

// 获取商品下拉列表
export const getSelectProduct = async (params: any) =>
  Request.get('/zwx-product/productinfo/purchase/page', { params });

// 栏目商品查询
export const getSelectArrayProduct = async (params: { current: number }) =>
  Request.get('/select', { prefix, params });

// 分类查询（添加分类）
export const getCategoriesModalList = async (params: {
  current: number;
  size: number;
  content?: string;
}) => Request.get('/category/page', { prefix, params });
