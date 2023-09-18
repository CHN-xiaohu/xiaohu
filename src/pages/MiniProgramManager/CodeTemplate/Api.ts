import { Request } from '@/foundations/Request';

export type CodeTemplateColumns = {
  createTime: string;
  id: number;
  remark: string;
  templateId: string;
  tenantCode: string;
  type: string;
  updateTime: string;
  userDesc: string;
  userVersion: string;
};

export type CodeTemplateDraftColumns = {
  createTime: string;
  userVersion: string;
  userDesc: string;
  draftId: number;
  templateId: string;
};

// 获取数据库中的代码模板列表
export const getTemplateList = async (data: any) =>
  Request.post('/zwx-system/aigoutemplate/getTemplateList', { data, showSuccessMessage: false });

// 获取正式代码库的模板列表
export const getFormalTemplateList = async () =>
  Request.get('/zwx-system/aigoutemplate/getFormalTemplateList', { showSuccessMessage: false });

// 添加模板
export const addToTemplate = async (data: any) =>
  Request.post('/zwx-system/aigoutemplate/addToTemplate', { data });

// 删除第三方平台的代码模板
export const deleteTemplate = async (data: any) =>
  Request.post('/zwx-system/aigoutemplate/deleteTemplate', { data });

// 删除数据库中维护的代码模板
export const deleteDbTemplate = async (data: any) =>
  Request.post('/zwx-system/aigoutemplate/deleteDbTemplate', { data });

// 修改代码模板
export const editTemplate = async (data: any) =>
  Request.post('/zwx-system/aigoutemplate/editTemplate', { data });

// 草稿箱同步模板
export const synchronizeData = async () =>
  Request.post('/zwx-system/aigoutemplate/synchronizeData', {});
