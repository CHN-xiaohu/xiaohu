import { Request } from '@/foundations/Request';
import type { PurchaseOrderColumns } from '@/pages/Order/Api';

export type GroupBuyColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  tenantCode: string;
  activityName: string;
  productId: number;
  productName: string;
  activityProductImg: string;
  unit: string;
  price: number;
  peopleNum: number;
  orderNum: number;
  sales: number;
  shareDescribe: string;
  shareTitle: string;
  imagePath: string;
  shareRedirectUrl: string;
  startTime: string;
  endTime: string;
  current: number;
  size: number;
  showStatus: number;
  bizGroupPurchaseConditions: any[];
};

const prefix = '/zwx-marketing/groupPurchase';

// 分页列表
export const getGroupBuys = async (data: any) =>
  Request.post('/selectActivityByCondition', {
    prefix,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<GroupBuyColumns>;

// 详情
export const getGroupBuy = async (id: string) =>
  Request.get<GroupBuyColumns>('/selectById', { prefix, params: { id } });

// 新增
export const addOrUpdateGroupBuy = async (data: any) =>
  Request.post<GroupBuyColumns>('/createOrmodifyGroupPurchase', { prefix, data });

// 修改状态
export const updateStatus = (params: { id: string; status: number }) =>
  Request.get<GroupBuyColumns>('/modifyStatus', { prefix, params });

// 根据分类 id 查找品牌数据
export const getGroupBuyProducts = async (data: any) =>
  Request.post<GroupBuyColumns>('/selectProduct', {
    prefix,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<GroupBuyColumns>;

export const delGroupBuy = async (id: string) =>
  Request.get<GroupBuyColumns>('/deleteActivity', {
    prefix,
    params: { id },
  });

// 获取团购活动订单列表
export const getGroupBuyOrders = async (params: any) =>
  Request.get('/zwx-order/bizsalesorder/group/page', {
    params,
  }) as PromiseResponsePaginateResult<PurchaseOrderColumns>;

export const groupBuyOrderRefund = async (orderId: string) =>
  Request.post('/zwx-order/bizsalesorder/refund/spreadPrice', {
    data: { orderId },
  }) as PromiseResponsePaginateResult<PurchaseOrderColumns>;
