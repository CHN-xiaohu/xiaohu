import { pathToRegexp } from 'path-to-regexp';

import type { RouteItem } from '@/typings/app';
import type { IntlShape } from 'umi';

import { isUrl, isCnCharacter } from './index';

type ArrangeRouteMapResult = Map<string, RouteItem>;

const mergePath = (path: string = '', parentPath: string = '/') => {
  if (isUrl(path)) {
    return path;
  }

  if ((path || parentPath).startsWith('/')) {
    return path;
  }

  return `/${parentPath}/${path}`.replace(/\/\//g, '/');
};

/**
 * 重新整理路由数据
 * 将路由统一以 url path 为 key 的形式挂载到变量中，用于快捷查找
 *
 * @example
 *  {
 *    '/': { path: '/', name: '首页', ... },
 *    '/home': { path: '/home', name: 'home', ... }
 * }
 *
 * @param RouteItem[] routes 路由配置
 */
export const arrangeRouteMap = (routes: RouteItem[], intl: IntlShape): ArrangeRouteMapResult => {
  const routerMap = new Map<string, RouteItem>();

  const flattenMenuData = (data: RouteItem[], parent?: RouteItem) => {
    data.forEach((item) => {
      if (!item || !item.path) {
        return;
      }

      if (item && (item.children || item.routes)) {
        flattenMenuData(item.children || item.routes, item);
      }

      if (item.edit_title && !isCnCharacter(item.edit_title)) {
        item.edit_title = intl?.formatMessage({
          id: item.edit_title,
          defaultMessage: item.edit_title,
        });
      }

      const path = mergePath(item.path, parent ? parent.path : '/');

      // 将路由统一以 url path 为 key 的形式挂载到变量中，用于快捷查找
      routerMap.set(path, item);
    });
  };

  flattenMenuData(routes);

  return routerMap;
};

/**
 * 切割整理 pathname
 *
 * /userinfo/2144/id => ['/userinfo','/useinfo/2144,'/userindo/2144/id']
 *
 * @ref https://github.com/ant-design/ant-design-pro-layout/blob/a622bfc0996fd24d9963ce1a30b84120c18041d6/src/utils/pathTools.ts
 *
 * @param pathname
 */
export function urlToList(pathname?: string): string[] {
  if (!pathname || pathname === '/') {
    return ['/'];
  }

  const urlList = pathname.split('/').filter((i) => i);

  return urlList.map((_, index) => `/${urlList.slice(0, index + 1).join('/')}`);
}

export const getBreadcrumb = (breadcrumbMap: ArrangeRouteMapResult, url: string): RouteItem => {
  if (!breadcrumbMap) {
    return {
      path: '',
    };
  }

  let breadcrumbItem = breadcrumbMap.get(url);

  if (!breadcrumbItem) {
    // Find the first matching path in the order defined by route config
    // 按照 route config 定义的顺序找到第一个匹配的路径
    const targetPath = [...breadcrumbMap.keys()].find((path) => {
      // remove ? ,不然会重复
      return path.indexOf(url) === 0 || pathToRegexp(path.replace('?', '')).test(url);
    });

    if (targetPath) {
      breadcrumbItem = breadcrumbMap.get(targetPath);
    }
  }

  return breadcrumbItem || { path: '' };
};

/**
 * 获取面包屑
 *
 * @param {string} pathname 当前 url
 * @param {ArrangeRouteMapResult} routesMap 经过 arrangeRouteMap 格式化过的路由数据
 */
export const conversionFromLocation = (pathname: string, routesMap: ArrangeRouteMapResult) => {
  if (!pathname) {
    return [];
  }

  // 转化 pathname
  const urlList = urlToList(pathname);

  const paths = [] as string[];
  const result = urlList
    .map((url) => {
      const currentBreadcrumb = getBreadcrumb(routesMap, url);

      return currentBreadcrumb.inherited ? { path: '', breadcrumbName: '' } : currentBreadcrumb;
    })
    .filter((item) => {
      if (item && item.path && !paths.includes(item.path)) {
        paths.push(item.path);
        return true;
      }

      return false;
    });

  return result as RouteItem[];
};
