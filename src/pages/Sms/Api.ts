import { Request } from '@/foundations/Request';

const prefix = '/zwx-message';

const sms = {
  prefix: `${prefix}/sms`,
};

export type smsColumns = {
  phone: string;
  content: string;
};

export const getSmsList = async (params: any) => Request.get('/page-sms', { ...sms, params });
