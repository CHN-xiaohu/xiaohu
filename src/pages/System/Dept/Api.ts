import { Request } from '@/foundations/Request';

const prefix = '/zwx-system';

const dept = {
  prefix: `${prefix}/dept`,
};

export type deptColumns = {
  deptName: string;
  fullName: string;
  deptCategoryName: string;
  sort: number;
  id: string;
};

// 获取机构列表
export const getDeptList = async (params: any) => Request.get('/list', { ...dept, params });

// 获取机构树
export const getDeptTree = async () => Request.get('/tree?code=org_category', { ...dept });

// 获取机构类型
export const getDictionary = async () =>
  Request.get('/zwx-system/dict/dictionary?code=org_category');

// 添加机构
export const addDept = async (data: object) => Request.post('/submit', { ...dept, data });

// 获取机构详情
export const getDeptDetail = async (id: string) => Request.get(`/detail?id=${id}`, { ...dept });

// 删除机构
export const removeDept = async (params: any) => Request.post('/remove', { ...dept, params });
