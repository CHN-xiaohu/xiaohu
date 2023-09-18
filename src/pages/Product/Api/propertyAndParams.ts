import { Request } from '@/foundations/Request';

export type PropertyColumns = {
  categoryId: string;
  custom: number;
  name: string;
  optionType: number;
  // 1 为属性，2 为参数
  propType: 1 | 2;
  required: number;
  search: number;
  serial: number;
  categoryName: string;
  id: string;
  propVals: { id: string; name: string }[];
};

// 属性/参数相关
export const getPropertyList = async (params: any) =>
  Request.get('/zwx-product/productpropkeytemplate/page', {
    params: { ...params, name: params?.name?.trim() },
  }) as PromiseResponsePaginateResult<PropertyColumns>;

export const getPropertyByCategoryId = async (params: { categoryId: string; propType: number }) =>
  Request.get<PropertyColumns>(
    '/zwx-product/productpropkeytemplate/selectValidKeyValByCategoryId',
    { params },
  );

export const updatePropertyStatus = async (data: { id: string; status: number }) =>
  Request.post<PropertyColumns>('/zwx-product/productpropkeytemplate/updateStatus', { data });

export const saveProperty = async (data: any) =>
  Request.post<PropertyColumns>('/zwx-product/productpropkeytemplate/save', {
    data: { ...data, name: data.name?.trim() },
  });

export type PropertyValueColumns = {
  id: string;
  name: string;
  productPropKeyTemplateId: string;
  serial: number;
  status: number;
  createTime: string;
  image: string;
};

// 属性/参数值相关
export const updatePropertyValueStatus = async (data: { id: string; status: number }) => {
  Request.post<PropertyValueColumns>('/zwx-product/productpropvaltemplate/updateStatus', { data });
};

export const getPropertyValueList = async (params: any) =>
  Request.get('/zwx-product/productpropvaltemplate/page', {
    params: { ...params, name: params?.name?.trim() },
  }) as PromiseResponsePaginateResult<PropertyValueColumns>;

export const deleteParams = async (id: string) =>
  Request.delete<PropertyValueColumns>('/zwx-product/productpropkeytemplate/delete', {
    params: { id },
  });

export const savePropertyValue = async (data: any) =>
  Request.post<PropertyValueColumns>('/zwx-product/productpropvaltemplate/save', {
    data: { ...data, name: data.name?.trim() },
  });

export const deleteParamsValue = async (id: string) =>
  Request.delete<PropertyValueColumns>('/zwx-product/productpropvaltemplate/delete', {
    params: { id },
  });
