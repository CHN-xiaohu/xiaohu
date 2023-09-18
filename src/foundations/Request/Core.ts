/**
 * request 网络请求工具
 *
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import type { ResponseError } from 'umi-request';
import { extend } from 'umi-request';
import { notification, message as messageComp } from 'antd';
import { Base64 } from 'js-base64/base64.js';

import { AppConfig } from '@/config';
import { UserAuthTokenCache } from '@/services/User';
import { history } from 'umi';

import { Sentry } from '@/sentry';

import defaultSettings from '../../../config/defaultSettings';

// 拓展类型
declare module 'umi-request' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface RequestOptionsInit {
    showErrorMessage?: boolean;
    successMessage?: string;
    errorMessage?: string;
    notAutoHandleResponse?: boolean;
    showSuccessMessage?: boolean;
  }
}

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

/**
 * 异常处理程序
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (error: ResponseError) => {
  // 网络异常
  if (error.message === 'Failed to fetch') {
    notification.error({
      message: '网络异常',
      description: `${error.message}:${error?.request?.url}`,
    });
  }

  Sentry.setContext('response', error.response);
  Sentry.captureException('请求异常');

  return Promise.reject(error);
};

/**
 * 配置request请求时的默认参数
 */
const BaseRequest = extend({
  errorHandler,
});

// 请求拦截器
BaseRequest.interceptors.request.use((url, options) => {
  // eslint-disable-next-line no-param-reassign
  url = /^(http|https)?:\/\//.test(url) ? url : `${AppConfig.apiUrl}${url}`;

  // 当请求的 url 携带 .json 等后缀，那么就代表是请求资源文件，就无需进行拦截处理了
  if (url.includes('.json')) {
    return {
      url,
      options,
    };
  }

  options.headers = {
    ...(options.headers || {}),
    // 客户端认证
    Authorization: `Basic ${Base64.encode(
      `${defaultSettings.clientId}:${defaultSettings.clientSecret}`,
    )}`,
  };

  const token = UserAuthTokenCache.get();
  if (token) {
    options.headers = {
      ...options.headers,
      'Zafix-Auth': token,
    };
  }

  return {
    url,
    options: {
      showSuccessMessage: true,
      showErrorMessage: true,
      ...options,
    } as typeof options,
  };
});

// response 拦截器
BaseRequest.interceptors.response.use(async (response, options) => {
  let data = { code: 500, msg: '', data: null, time: new Date().valueOf() };
  try {
    data = await response.clone().json();
  } catch {
    //
  }

  if (options.notAutoHandleResponse) {
    return options.getResponse ? response : (data as any);
  }

  const isGet = ['GET'].includes(options.method!.toLocaleUpperCase());
  const httpCode = Number(data.code);

  if (httpCode !== 200) {
    if (httpCode === 401) {
      window.$fastDispatch((model) => model.user.logout);
    } else if (httpCode === 403) {
      history.push('/exception/403');
    } else if ([404, 500].includes(httpCode)) {
      if (!isGet) {
        messageComp.error(options.errorMessage || data.msg);
      } else {
        notification.error({
          message: `请求错误 ${data.code}: ${response.url}`,
          description: options.errorMessage || data.msg,
        });
      }
    } else if (options.showErrorMessage || (options.method && !['GET'].includes(options.method))) {
      // 判断是否需要自动显示错误信息
      messageComp.error(options.errorMessage || data.msg);
    }

    return Promise.reject(data.msg);
  }

  if (options.successMessage || (options.showSuccessMessage && !isGet)) {
    messageComp.success(options.successMessage || data.msg);
  }

  return response;
});

export { BaseRequest };
