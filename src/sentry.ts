import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { isArr } from '@spark-build/web-utils';

import { UserInfoCache } from './services/User';

const isProd = process.env.NODE_ENV === 'production';

// todo: 懒加载
if (isProd) {
  Sentry.init({
    dsn: 'https://cc70109616004662afe6d1c5914c9066@sentry.zazfix.com/2',
    autoSessionTracking: true,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,

    /**
     * @see https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
     * @see https://github.com/WICG/resize-observer/issues/38
     * @see https://github.com/ant-design/ant-design/issues/23246
     */
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
      // 过滤掉 useRequest 的异常，请求的异常交由 axios 去做
      // eslint-disable-next-line max-len
      'useRequest has caught the exception, if you need to handle the exception yourself, you can set options.throwOnError to true.',
    ],

    beforeSend(event) {
      const isPromiseError =
        event.exception?.values?.[0]?.mechanism?.type === 'onunhandledrejection';

      if (isPromiseError) {
        // 过滤 form 表单的校验异常信息
        if (isArr(event.message) && event.message[0]?.messages) {
          return null;
        }
      }

      return event;
    },
  });
}

const sentryWrap = <T extends (...args: any[]) => void>(fn: T) => (isProd ? fn : () => {});

export const injectionTenantAndUserInfoToSentry = sentryWrap(() => {
  if (!isProd) {
    return;
  }

  const userInfo = UserInfoCache.get();

  if (!userInfo) {
    return;
  }

  Sentry.setUser({
    userId: userInfo.userId,
    account: userInfo.account,
  });

  Sentry.setContext('租户信息', {
    tenantCode: userInfo.tenantCode,
    name: userInfo.name,
  });
});

function init() {
  injectionTenantAndUserInfoToSentry();
}
init();

export { Sentry };
