import { Request } from '@/foundations/Request';

const miniDeployPrefix = {
  prefix: '/zwx-system/miniProgram',
};

const miniPay = {
  prefix: '/zwx-payment/payconfigs',
};

export type MiniDeployColumn = {
  auxiliaryColor: string;
  mainColor: string;
};

// 添加通用配置
export const addMiniDeploy = async (data: any) =>
  Request.post('/insertOrUpdataSetting', { ...miniDeployPrefix, data, showSuccessMessage: false });

// 获取通用配置
export const getMiniDeploy = async () =>
  Request.get('/querySettingByTenantCode', { ...miniDeployPrefix, showSuccessMessage: false });

// 添加支付配置信息
export const addPayDeploy = async (data: any) => Request.post('/createMiniP', { ...miniPay, data });

// 获取支付配置信息
export const getPayDeploy = async () =>
  Request.get('/miniDetail?channelCode=wxpay', { ...miniPay });

// 获取功能开关设置
export const getFunctionalSwitch = async (data: any) =>
  Request.get(`/zwx-user/info/getOwnerSetting?configType=${data.configType}`, {});

// 更改功能开关设置
export const changeFunctionSwitch = async (data: any) =>
  Request.post('/zwx-user/info/updateOwnerSetting', { data, showSuccessMessage: false });

// 获取预授权码
export const getPreAuthorizationCode = async () =>
  Request.post('/zwx-system/wxAuthorize/getPreAuthCode', {});

// 体验码
export const getExperienceCode = async (path: string) =>
  Request.post('/zwx-system/wxAuthorize/getQrCode', {
    data: {
      path: `${path}`,
    },
    notAutoHandleResponse: true,
    getResponse: true,
    headers: {
      Accept: '*/*',
    },
  }).then(async (res: any) => {
    const blob = await res.response.clone().blob();
    return blob?.type ? (window.URL || window.webkitURL).createObjectURL(blob) : '';
  });
// 正式码
export const getOfficialCode = async (path: string) =>
  Request.post('/zwx-system/wxAuthorize/createWxAqrCode', {
    data: {
      path: `${path}`,
    },
    notAutoHandleResponse: true,
    getResponse: true,
    headers: {
      Accept: '*/*',
    },
  }).then(async (res: any) => {
    const blob = await res.response.clone().blob();
    return blob?.type ? (window.URL || window.webkitURL).createObjectURL(blob) : '';
  });

// 基础信息以及授权是否成功
export const obtainTheAuthorizationInformationOfTheAuthorizer = async () =>
  Request.post('/zwx-system/wxAuthorize/whetherAuthorize', { showSuccessMessage: false });

// 获取正式代码库模板列表
export const getAListOfOfficialCodeBaseTemplates = async () =>
  Request.post('/zwx-system/wxminiprgmtemplate/getTemplateList', { showSuccessMessage: false });

// 查看提交审核记录
export const getReleaseHistory = async () =>
  Request.post('/zwx-system/wxAuthorize/getreleasehistory', { showSuccessMessage: false });

// 提交审核
export const submitReview = async (data: any) =>
  Request.post('/zwx-system/wxAuthorize/commitCode', { data, showSuccessMessage: false });

// 撤回审核
export const miniProgramReviewWithdrawal = async () =>
  Request.post('/zwx-system/wxAuthorize/undoCodeAudit', {});

// 发布上线
export const publishApprovedMiniPrograms = async () =>
  Request.post('/zwx-system/wxAuthorize/release', {});

// 设置服务器域名
export const setServerDomainName = async (data: any) =>
  Request.post('/zwx-system/wxAuthorize/setServerDomain', { data });

// 设置业务域名
export const setUpBusinessDomainName = async (data: any) =>
  Request.post('/zwx-system/wxAuthorize/setWebViewDomain', { data });

// 获取服务器域名
export const getServerDomainName = async () =>
  Request.get('/zwx-system/wxAuthorize/getServerDomain', {});

// 获取业务域名
export const getBusinessDomainName = async () =>
  Request.get('/zwx-system/wxAuthorize/getWebViewDomain', {});
