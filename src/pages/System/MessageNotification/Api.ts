import { Request } from '@/foundations/Request';

export type Templates = {
  id: string;
  templateId: string;
  status: number;
  fieldMapping: any[];
  content: string;
  purposeId: string;
};

export type SystemFields = {
  id: string;
  fieldName: string;
  fieldAlias: string;
  fieldType: string;
  appType: number;
  showStatus: number;
};

export type TemplateUsageList = {
  id: string;
  purposeName: string;
  groupType: string;
  page: string;
  type: string;
  miniprogramState: string;
  appType: number;
};

// id
// 模板用途id
// 模板id
// 1 启用 2禁用
// 模板内容
// 模板示例

// 获取品牌商模板列表
export const getTemplates = (data: any) =>
  Request.post('/zwx-system/wxPush/tenant/getTemplates', {
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<Templates>;

// 获取系统字段
export const getSystemFields = (params: AnyObject) =>
  Request.get<SystemFields[]>('/zwx-system/wxPush/getTemplateFields', { params });

// 更新保存模板
export const updateSaveTemplate = (data: any) =>
  Request.post('/zwx-system/wxPush/saveOrUpdate', { data });

// 获取模板用途列表
export const getTemplateUsageList = (params: AnyObject) =>
  Request.get<TemplateUsageList[]>('/zwx-system/wxPush/getTemplatePurpose', { params });

// 删除模板
export const deleteMessageTemplate = (params: AnyObject) =>
  Request.get('/zwx-system/wxPush/deleteTemplateDetailById', { params });
