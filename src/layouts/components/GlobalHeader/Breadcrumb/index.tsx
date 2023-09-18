import { memo, useCallback } from 'react';
import { history } from 'umi';
import { Breadcrumb as AntdBreadcrumb } from 'antd';

import type { RouteItem } from '@/typings/app';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

export const Breadcrumb = memo(() => {
  const { breadcrumb } = useStoreState('app');
  const currentRoute = breadcrumb[breadcrumb.length - 1] || ({} as RouteItem);

  const renderFullBreadcrumb = useCallback(
    (breadcrumbs: RouteItem[]) => (
      <AntdBreadcrumb>
        {breadcrumbs.map((route, index) => {
          const { title } = route;

          return (
            <AntdBreadcrumb.Item key={title + route.path}>
              {index === breadcrumbs.length - 1 || route.notShowLink ? (
                <span id="setBreadcrumbTextToCreateOrUpdate">{title}</span>
              ) : (
                <a onClick={() => history.push(route.path)}>{title}</a>
              )}
            </AntdBreadcrumb.Item>
          );
        })}
      </AntdBreadcrumb>
    ),
    [],
  );

  if (breadcrumb.length > 1) {
    return renderFullBreadcrumb(breadcrumb.filter((item) => !item.hideBreadcrumb));
  }

  if (currentRoute.hideBreadcrumb) {
    return null;
  }

  return <>{currentRoute.title}</>;
});
