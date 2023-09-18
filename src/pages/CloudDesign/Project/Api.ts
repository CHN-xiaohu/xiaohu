import { Request } from '@/foundations/Request';

const prefix = '/zwx-kujiale';

const projectPrefix = {
  prefix: `${prefix}/design`,
};

export type ProjectColumns = {
  designId: string;
  planId: string;
  status: number;
  commName: string;
  city: string;
  name: string;
  srcArea: number;
  specName: string;
  area: number;
  created: string;
  modifiedTime: string;
  planPic: string;
  coverPic: string;
  descrption: string;
  tagId: string;
  designPanoUrl: string;
};

// 获取方案列表
export const getProjectList = async (params: any) =>
  Request.get('/designList', { ...projectPrefix, params });

// 删除方案
export const delProject = async (id: string) =>
  Request.delete(`/deleteDesign?planId=${id}`, { ...projectPrefix });

// 复制方案
export const copyProject = async (designId: string) =>
  Request.post('/copyDesign', { ...projectPrefix, params: { designId } });

// 修改方案名称
export const updateName = async (data: any) =>
  Request.post('/updateDesignName', { ...projectPrefix, data });

// 查询标签
export const getTabsList = async () => Request.get('/tagList', { ...projectPrefix });

// 查询方案id标签
export const getSetTabs = async (id: string) =>
  Request.get(`/designTags?designId=${id}`, { ...projectPrefix });

// 给方案设置标签
export const settleTags = async (data: any) =>
  Request.post('/settleDesignTags', { ...projectPrefix, data });

// 获取域名列表
export const getDomainName = async (params: { tenantCode: string }) =>
  Request.get<ProjectColumns[]>('/zwx-system/sysTenantDomainSetting/getDomainList', { params });

// 查询我的方案列表
export const getMyDesignList = (params: any) =>
  Request.get('/myList', { ...projectPrefix, params });

// 查询设计师方案
export const getDesignerProject = async (params: any) =>
  Request.get('/designerList', { ...projectPrefix, params });

// 查询推荐方案
export const getRecommendProject = async (params: any) =>
  Request.get('/recommendList', { ...projectPrefix, params });

// 方案设置推荐、取消推荐
export const setOrCancelRecommends = async (data: object) =>
  Request.post('/settleRecommend', { ...projectPrefix, data, showSuccessMessage: false });

// 查询设计师分页
export const getDesigners = async (params: any) =>
  Request.get('/zwx-kujiale/account/designerList', { params });

// 同步方案
export const syncDesign = () => Request.get('/zwx-kujiale/design/syncDesignData');

// 推广二维码
export const getDesignQR = async (id: string) =>
  Request.post('/zwx-product/wxQrScene/getQr', {
    data: {
      path: `pages/DesignScheme/Detail/index?id=${id}`,
    },
    notAutoHandleResponse: true,
    getResponse: true,
    headers: {
      Accept: '*/*',
    },
  }).then(async (res: any) => {
    const blob = await res.response.clone().blob();
    console.log(blob?.type);
    return blob?.type ? (window.URL || window.webkitURL).createObjectURL(blob) : '';
  });

// 同步方案清单
export const syncList = async (data: object) =>
  Request.post('/zwx-kujiale/design/syncList', { data });
