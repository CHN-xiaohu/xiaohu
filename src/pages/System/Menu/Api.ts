import { Request } from '@/foundations/Request';

const menuPrefix = {
  prefix: '/zwx-system/menu',
};

export type menuColumn = {
  name: string;
  source: string;
  code: string;
  alias: string;
  path: string;
  sort: number;
  id: string;
};

// 查询菜单类别
export const getMenuList = async (params: any) => Request.get('/list', { ...menuPrefix, params });

// 删除菜单
export const removeMenu = async (params: any) => Request.post('/remove', { ...menuPrefix, params });

// 菜单树
export const getMenuTree = async () => Request.get('/tree', { ...menuPrefix });

// 添加菜单
export const addMenu = async (data: any) => Request.post('/submit', { ...menuPrefix, data });

// 菜单详情
export const getMenuDetail = async (id: string) =>
  Request.get(`/detail?id=${id}`, { ...menuPrefix });
