import { Modal } from 'antd';

import { AppConfig } from '@/config';

import { stringify } from 'qs';

import {
  getPreAuthorizationCode,
  miniProgramReviewWithdrawal,
  publishApprovedMiniPrograms,
} from '../../../Api';

// 立即授权
export const authorizeNow = (refresh: any) => {
  getPreAuthorizationCode().then((res) => {
    const componentAppid = res.data.componentAppId;
    const authCode = res.data.preAuthCode;
    const domainName = window.location.host;
    const redirectUri = `${
      AppConfig.apiUrl
    }/wx-third-party-platforms/AuthorizationStatus.html?tenantCode=${
      window.injectionGlobalDataSource.code || '888888'
    }&domainName=${domainName}`;

    const authorizationPage = `${AppConfig.apiUrl}/wx-third-party-platforms/jump.html?${stringify({
      component_appid: componentAppid,
      pre_auth_code: authCode,
      redirect_uri: redirectUri,
    })}`;

    Modal.confirm({
      title: '提示',
      content: '请在新窗口完成微信小程序授权',
      okText: '已完成',
      cancelText: '重试',
      onOk: () => {
        refresh();
      },
      onCancel: () => {
        window.open(authorizationPage);
      },
    });

    window.open(authorizationPage);
  });
};

// 撤回审核
export const withdrawalOfReview = (refresh: any) => {
  Modal.confirm({
    title: '确定撤回审核吗？',
    onOk: () => {
      miniProgramReviewWithdrawal().then(() => {
        refresh();
      });
    },
  });
};

// 发布上线
export const releaseOnline = (refresh: any) => {
  Modal.confirm({
    title: '确定发布上线吗？',
    onOk: () => {
      publishApprovedMiniPrograms().then(() => {
        refresh();
      });
    },
  });
};
