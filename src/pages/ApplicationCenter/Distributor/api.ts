import type { FnParams } from '@/foundations/hooks';
import { Request } from '@/foundations/Request';

import type { RecruitDistributorRuleType } from './Tabs/RecruitmentPlan/constants';

import type { SalesmanColumns } from '../Salesman/Api';

export type DistributorColumns = {
  applyTime: string;
  auditMsg: string;
  auditStatus: number;
  createDept: string;
  createTime: string;
  createUser: string;
  id: string;
  identityType: number;
  invitationDistributorId?: string;
  invitationDistributorName?: string;
  isDeleted: number;
  name: string;
  oauthId: string;
  registerPhone: string;
  status: number;
  tenantCode: string;
  totalFansNum: number;
  totalUnsettlementAmount: number;
  totalWithdrawalProfit: number;
  totalProfit: number;
  updateTime: string;
  updateUser: string;
  userId: string;
};

export const getDistributor = (data: FnParams) =>
  Request.post('/zwx-user/sysDistributorAccount/getDistributorAccountPage', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<DistributorColumns[]>;

// 查询分销员设置开关状态(粉丝裂变)
export const getDistributorEnableStatus = () =>
  Request.get<number>('/zwx-system/sysDistributorSetting/getOpenTypeDistributorSetting');

// (分销员裂变)是否开启  0 开启 1 关闭
export const updateDistributorEnableStatus = (openStatus: 0 | 1) =>
  Request.get<number>('/zwx-system/sysDistributorSetting/updateOpenTypeDistributorSetting', {
    params: { openStatus },
  });

// 获取消费者列表（尚未开通分销员的用户列表）
export type NotRegisteredDistributorColumns = {
  //
} & DistributorColumns;
export const getNotRegisteredDistributor = (data: FnParams) =>
  Request.post('/zwx-user/sysDistributorAccount/getunRegisteredDistributorUser', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<NotRegisteredDistributorColumns[]>;

// 批量开通分销员
export const applyDistributor = (ids: string[]) =>
  Request.post('/zwx-user/sysDistributorAccount/applyDistributors', { data: { ids } });

// 获取分销员列表不分页
export const getAllDistributor = () =>
  Request.get<DistributorColumns[]>('/zwx-user/sysDistributorAccount/getRegisteredDistributorUser');

// 编辑修改分销员
export const updateDistributor = (data: { id: string; invitationDistributorId?: string }) =>
  Request.post('/zwx-user/sysDistributorAccount/updateDistributorById', { data });

// 批量审核分销员
export const batchAuditDistributor = (data: {
  // 需要修改状态的分销员id
  ids: string[];
  // 修改的状态 0 待审核 1审核通过 2审核不通过
  auditStatus: 1 | 2;
  auditMsg: string;
}) => Request.post('/zwx-user/sysDistributorAccount/batchAuditDistributor', { data });

// 获取分销员招募计划
export type RecruitDistributorRuleColumns = {
  content: { contentType: 1 | 2; content: string; contentAttribute: string; serial: number }[];
  createDept: string;
  createTime: string;
  createUser: string;
  id: string;
  isDeleted: number;
  status: number;
  tenantCode: string;
  title: string;
  type: string;
  updateTime: string;
  updateUser: string;
};
export const getRecruitDistributorRule = (type: ValueOf<typeof RecruitDistributorRuleType>) =>
  Request.post('/zwx-system/sysDistributorSetting/getRecruitDistributorRule', {
    data: { type },
    showSuccessMessage: false,
  });

// 保存分销员招募计划
export const saveOrUpdateDistributorRules = (
  data: Pick<RecruitDistributorRuleColumns, 'id' | 'title' | 'content' | 'type'>,
) => Request.post('/zwx-system/sysDistributorSetting/saveOrUpdateDistributorRules', { data });

// 获取分享设置与海报设置
export type DistributorExtensionColumns = {
  id: string;
  styleJson: {
    // 二维码高度
    qrCodeHeight: number;
    // 二维码宽度
    qrCodeWidth: number;
    // 背景图宽度
    backgroundImageWidth: number;
    // 背景图高度
    backgroundImageHeight: number;
    // 二维码左边距
    qrCodeLeft: number;
    // 二维码顶边距
    qrCodeTop: number;
    // 风格
    style: number;
    // 背景图
    backgroundImg: string;
  }[];
  // 分享标题
  shareTitle: string;
  // 分享内容
  shareContent: string;
  // 分享图标
  icon: string;
  extensionType: number;
};
export const getDistributorExtension = () =>
  Request.get<DistributorExtensionColumns>(
    '/zwx-system/sysDistributorSetting/getDistributorExtension',
  );

// 保存分销员分享设置
export const saveOrUpdateDistributorExtension = (
  data: Pick<DistributorExtensionColumns, 'shareTitle' | 'shareContent' | 'icon'>,
) => Request.post('/zwx-system/sysDistributorSetting/saveOrUpdateDistributorExtension', { data });

// 保存分销员招募海报设置
export const saveOrUpdateDistributorExtensionStyle = (
  styleJson: DistributorExtensionColumns['styleJson'],
) =>
  Request.post('/zwx-system/sysDistributorSetting/saveOrUpdateDistributorExtensionStyle', {
    data: { styleJson },
  });

// 获取分销员配置
export type DistributorSettingColumns = {
  id: string;
  name: string;
  isRecruit: number;
  openStatus: number;
  auditType: number;
  businessType: number;
  extensionCommission: number;
  invitationCommission: number;
  selfSubCommission: number;
};
export const getDistributorSetting = () =>
  Request.get<DistributorSettingColumns>(
    '/zwx-system/sysDistributorSetting/getSysDistributorSettingByTenantCode',
  );

// 保存分销员设置
export const saveOrUpdateDistributorSetting = (data: DistributorSettingColumns) =>
  Request.post('/zwx-system/sysDistributorSetting/saveOrUpdate', { data });

// 获取分佣商家列表
export type CommissionStoresColumns = {
  id: string;
  createUser: string;
  createDept: string;
  createTime: string;
  updateUser: string;
  updateTime: string;
  status: number;
  isDeleted: number;
  tenantCode: string;
  storeId: string;
  commission: string;
  startTime: string;
  endTime: string;
  content: string;
  current: number;
  size: number;
  hasVip: number;
  storeName: string;
  registerPhone: string;
};
export const getSetCommissionStores = (data: AnyObject) =>
  Request.post('/zwx-user/sysDistributorStoreCommission/getSetCommissionStorePage', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<CommissionStoresColumns[]>;

// 设置商家分佣比例
type BatchStoreCommissionData = { ids: string[]; commission: number | string };
export const updateBatchStoreCommission = (data: { ids: string[]; commission: number | string }) =>
  Request.post('/zwx-user/sysDistributorStoreCommission/updateBatchStoreCommission', { data });

export const saveBatchStoreCommission = (data: BatchStoreCommissionData) =>
  Request.post('/zwx-user/sysDistributorStoreCommission/saveBatchStoreCommission', { data });

// 获取未开通分佣的商家列表
export type UnsetCommissionStoresColumns = {
  //
} & SalesmanColumns;
export const getUnsetCommissionStores = (data: AnyObject) =>
  Request.post('/zwx-user/sysDistributorStoreCommission/getUnsetCommissionStorePage', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<UnsetCommissionStoresColumns[]>;

export type PromotionOrderColumns = {
  id: string;
  salsesOrderId: string;
  // 下单时间
  createTime: string;
  // 订单编号
  salsesOrderSn: string;
  // 订单状态，同采购单订单状态
  orderStatus: number;
  // 实付金额
  totalMoney: number;
  // 订单总分佣
  totalRate: number;

  // 订单佣金用 totalMoney * totalRate
  orderExtendPrice?: number;
  // 入账状态 1：入账中，2：已入账，3：已取消
  recordedAmountOfStatus: number;
  // 入账时间
  incomeTime: string;
  // 下单商家
  consumerName: string;
  salesExtendInfos: {
    // 分佣类型
    extendTypeName: string;
    // 分佣利率
    extendRate: number;
    // 分佣金额
    extendPrice: number;
    // 微信昵称
    nickName: string;
  }[];
};
// 推广订单
export const getPromotionOrder = (params?: AnyObject) =>
  Request.get('/zwx-order/bizsalesorderextendorderrecord/admin/page', {
    params,
  }) as PromiseResponsePaginateResult<PromotionOrderColumns[]>;

// 获取指定用户的 [今日新增收益金额]
export const getUserBonus = (userId: string) =>
  Request.get(`/zwx-order/bizsalesorderextendorderrecord/bonus/${userId}`);
