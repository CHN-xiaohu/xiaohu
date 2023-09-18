import { Request } from '@/foundations/Request';

const platformPrefix = {
  prefix: '/zwx-system/tenant',
};

export const getPlatform = async (id: string) =>
  Request.get(`/detail?id=${id}`, { ...platformPrefix });

export const addPlatform = async (data: string) =>
  Request.post('/submit', { ...platformPrefix, data });
