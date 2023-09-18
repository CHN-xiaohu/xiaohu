import { Request } from '@/foundations/Request';

const prefix = '/zwx-system';

const edition = {
  prefix: `${prefix}/edition`,
};

export type editionColumns = {
  mobileSystem: number;
  forceUpdate: number;
  editionCode: string;
  editionSerialCode: string;
  lowestEditionCode: string;
  effectiveTime: string;
  updateContent: string;
};

// 获取版本信息列表
export const getEditonList = async (params: any) => Request.get('/page', { ...edition, params });

// 添加版本信息
export const addEdition = async (data: object) => Request.post('/save', { ...edition, data });

// 删除版本信息
export const deleteEdition = async (id: string) => Request.delete(`/remove/${id}`, { ...edition });
