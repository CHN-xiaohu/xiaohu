import { IRoute } from '@umijs/types';

const isCnCharacter = (str: string) => /[\u4E00-\u9FA5\uFE30-\uFFA0]/.test(str);

export const createRoutes = (routes: (IRoute & { edit_title?: string })[], localPrefix = '') => {
  return routes.map((item) => {
    let cLocalPrefix = '';

    if (item.title && !isCnCharacter(item.title)) {
      const originTitle = item.title;

      item.title = [localPrefix, item.title].filter(Boolean).join('.');

      // 如果带有 . 连接符，那么就代表无须进行父子层级间的绑定
      if (originTitle.indexOf('.') === -1) {
        cLocalPrefix = item.title;
      }
    }

    if (item.edit_title && !isCnCharacter(item.edit_title)) {
      item.edit_title = [localPrefix, item.edit_title].filter(Boolean).join('.');
    }

    if (item.routes) {
      item.routes = createRoutes(item.routes, cLocalPrefix || localPrefix);
    }

    return item;
  });
};
