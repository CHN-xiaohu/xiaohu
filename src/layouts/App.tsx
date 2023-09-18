import '../sentry';

import { useMemo, useEffect } from 'react';
import { history, getDvaApp, useIntl } from 'umi';
import { useMount } from 'ahooks';

import type { Store } from 'redux';

import { Authorized } from '@/components/Authorized';
import { arrangeRouteMap, conversionFromLocation } from '@/utils/Breadcrumb';
import type { RouteChildrenProps } from '@/typings/basis';

import * as Sentry from '@sentry/react';

declare global {
  interface Window {
    __AppStore: Store<any, DvaAnyAction>;
    __AppBreadcrumb: RouteChildrenProps['route']['routes'];
  }
}

const removeInitializeApplicationNode = () => {
  const InitializeApplicationNode = document.getElementById('InitializeApplication');

  if (InitializeApplicationNode) {
    requestAnimationFrame(() => {
      InitializeApplicationNode.style.opacity = '0';
      InitializeApplicationNode.style.zIndex = '-9999';

      setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            document.body.removeChild(InitializeApplicationNode);
          } catch {
            //
          }
        });
      }, 30 * 1000);
    });
  }
};

const setDocumentTitle = (title: string) => {
  document.title = title;
};

// eslint-disable-next-line no-underscore-dangle
window.__AppStore = getDvaApp()._store;

// 根容器组件
const RootLayout: React.FC<RouteChildrenProps> = ({ children, location, route }) => {
  const intl = useIntl();
  // 其实这里生成一次就好了，但是可能后面会动态修改路由数据
  const routesMaps = useMemo(() => arrangeRouteMap(route.routes, intl), [intl, route.routes]);

  useMount(() => {
    removeInitializeApplicationNode();
  });

  useEffect(() => {
    // 获取面包屑数据
    const breadcrumb = conversionFromLocation(location.pathname, routesMaps);
    const lastBreadcrumb = breadcrumb[breadcrumb.length - 1] || ({} as any);
    const { redirectUrl } = lastBreadcrumb;

    // eslint-disable-next-line no-underscore-dangle
    window.$fastDispatch((model) => model.app.updateState, {
      breadcrumb: Array.isArray(breadcrumb) ? breadcrumb : [],
    });

    // eslint-disable-next-line no-underscore-dangle
    window.__AppBreadcrumb = breadcrumb;

    // 因为 umi 路由的 redirect 会导致 layout rerender, 所以在 root layout 这里自己定制实现一下
    if (redirectUrl) {
      requestAnimationFrame(() => history.replace(redirectUrl));
    }

    // 从面包屑数据中找到当前路由数据
    const PageTitle = `${!lastBreadcrumb.name ? '' : `${lastBreadcrumb.name} - `}管理后台`;

    setDocumentTitle(PageTitle);
  }, [location.pathname, routesMaps]);

  // TODO: 鉴权行为不应该是放置在这里
  return (
    <Sentry.ErrorBoundary fallback={'error boundary'}>
      <Authorized location={location}>{children}</Authorized>
    </Sentry.ErrorBoundary>
  );
};

export default RootLayout;
