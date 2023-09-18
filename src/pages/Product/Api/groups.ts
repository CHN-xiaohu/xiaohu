import { Request } from '@/foundations/Request';

export type GroupsColumns = {
  id: string;
  createTime: string;
  updateUser: string;
  status: number;
  name: string;
  enName: string;
  image: string;
  serial: number;
};

const prefix = '/zwx-product/productGroup';

// 分页列表
export const getGroupsList = async (data: any) =>
  Request.post('/selectGroupPage', {
    prefix,
    data,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<GroupsColumns>;

// 不分页列表
export const getBizGroupSelectorList = async (params: any) =>
  Request.get('/selectBizGroupSelectorList', {
    prefix,
    params,
    showSuccessMessage: false,
  }) as PromiseResponsePaginateResult<GroupsColumns>;

// 分组列表不分页
export const getGroupsNoPage = async (data: any) =>
  Request.post<GroupsColumns[]>('/selectGroupList', { prefix, data, showSuccessMessage: false });

// 删除分组
export const delGroups = async (id: string) => Request.get(`/deleteGroup?id=${id}`, { prefix });

// 添加、修改分组
export const saveOrUpdatetGroups = async (data: any) =>
  Request.post('/saveOrUpdateGroup', { prefix, data });

// 商品批量绑定或批量替换分组
export const bindingOrReplaceGroup = async (data: any) =>
  Request.post('/bindingOrReplaceGroup', { prefix, data });
