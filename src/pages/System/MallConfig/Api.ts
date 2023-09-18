import { Request } from '@/foundations/Request';
import type { RequestOptionsInit } from 'umi-request';

const pcMallPrefix = {
  prefix: '/zwx-system/sysShoppingMall',
};

const pcPayPrefix = {
  prefix: '/zwx-payment/payconfigs',
};

const consumerPrefix = {
  prefix: '/zwx-system/config/customer-service',
};

export type MiniDeployColumn = {
  auxiliaryColor: string;
  mainColor: string;
};

// 获取通用配置
export const getPcMallDeploy = async () =>
  Request.get('/findSysShoppingMallSetting', { ...pcMallPrefix });

// 添加通用配置
export const addPcMallDeploy = async (data: any) =>
  Request.post('/saveOrupdate', { ...pcMallPrefix, data, showSuccessMessage: false });

// 获取支付配置
export const getPayment = async (channelCode: string) =>
  Request.get(`/detail?channelCode=${channelCode}&platformFlag=pc_shopping_mall`, {
    ...pcPayPrefix,
  });

// 添加支付配置
export const addPayment = async (data: object, options?: RequestOptionsInit) =>
  Request.post('/createOrUpdate', { ...pcPayPrefix, data, ...options });

// 获取客服配置
export const getConsumerService = async () =>
  Request.get('/detail?platformFlag=pc_shopping_mall', { ...consumerPrefix });

// 添加客服配置
export const addConsumerService = async (data: any) =>
  Request.post('/submit', { ...consumerPrefix, data });
