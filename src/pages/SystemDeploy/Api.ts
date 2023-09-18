import { Request } from '@/foundations/Request';

const appSystemPrefix = {
  prefix: '/zwx-system/config/app',
};

const payPrefix = {
  prefix: '/zwx-payment/payconfigs',
};

const wechatPrefix = {
  prefix: '/zwx-system/config/wechat',
};

const consumerPrefix = {
  prefix: '/zwx-system/config/customer-service',
};

export const getAppSystem = async () => Request.get('/detail', { ...appSystemPrefix });

export const addAppSystem = async (data: object) =>
  Request.post('/saveConfig', { ...appSystemPrefix, data });

export const addPayment = async (data: object) =>
  Request.post('/createOrUpdate', { ...payPrefix, data, showSuccessMessage: false });

export const getPayment = async (channelCode: string) =>
  Request.get(`/detail?channelCode=${channelCode}`, { ...payPrefix });

export const AddWeChat = async (data: any) => Request.post('/submit', { ...wechatPrefix, data });

export const getWeChat = async () => Request.get('/detail', { ...wechatPrefix });

export const addConsumerService = async (data: any) =>
  Request.post('/submit', { ...consumerPrefix, data });

export const getConsumerService = async () => Request.get('/detail', { ...consumerPrefix });
