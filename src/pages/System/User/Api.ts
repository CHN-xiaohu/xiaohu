import { Request } from '@/foundations/Request';

const prefix = '/zwx-user';

const user = {
  prefix,
};

export type userColumns = {
  account: string;
  name: string;
  realName: string;
  roleName: string;
  deptName: string;
  phone: string;
  email: string;
  status: number;
  id: string;
};

// 获取用户列表
export const getUserList = async (params: any) => Request.get('/list', { ...user, params });

// 删除用户
export const removeUser = async (params: any) => Request.post('/remove', { ...user, params });

// 获取所属角色树
export const getRoleTree = async () => Request.get('/zwx-system/role/tree?');

// 获取所属机构下拉列表
export const getDeptDownList = async () => Request.get('/zwx-system/tenant/deptList?');

// 添加用户
export const addUser = async (data: any) => Request.post('/submit', { ...user, data });

// 获取用户详情
export const getUserDetail = async (id: string) => Request.get(`/detail?id=${id}`, { ...user });

// 修改用户信息
export const updateUser = async (data: any) => Request.post('/update', { ...user, data });

// 角色配置
export const limitRole = async (params: any) => Request.post('/grant', { ...user, params });

// 重置密码
export const resetPassword = async (params: any) =>
  Request.post('/reset-password', { ...user, params });
