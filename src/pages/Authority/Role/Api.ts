import { Request } from '@/foundations/Request';

const prefix = '/zwx-system';

const role = {
  prefix: `${prefix}/role`,
};

export type roleColumn = {
  roleName: string;
  roleAlias: string;
  sort: number;
  id: string;
};

// 获取角色列表
export const getRoleList = async (params: any) => Request.get('/subuserList', { ...role, params });

// 删除角色
export const removeRole = async (params: any) => Request.post('/remove', { ...role, params });

// 获取下拉列表
export const downTree = async () => Request.get('/tree?', { ...role });

// 添加角色
export const addRole = async (data: any) => Request.post('/submit', { ...role, data });

// 角色详情
export const getRoleDetail = async (id: string) => Request.get(`/detail?id=${id}`, { ...role });

// 获取菜单列表
export const getMenuTree = async () => Request.get('/zwx-system/menu/grant-tree?');

// 权限设置
export const setGrant = async (data: any) => Request.post('/grant', { ...role, data });

// 用户已有的权限
export const getUserLimit = async (id: string) =>
  Request.get(`/zwx-system/menu/role-tree-keys?roleIds=${id}`);
