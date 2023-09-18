import { AppConfig } from '@/config';

import { memo } from 'react';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import type { IconComponentProps } from '@ant-design/icons/lib/components/Icon';

import icons from './IconList';
import type { TIconFromIconfontList } from './IconFromIconfontList';

export { icons };

export type IconProps = {
  type?:
    | keyof typeof icons
    // eslint-disable-next-line max-len
    | 'download'
    | 'delete'
    | 'crop'
    | 'collect'
    | 'zoom'
    | 'article'
    | 'orders'
    | 'wechat'
    | 'finance'
    | 'datas'
    | 'users'
    | 'set'
    | 'products'
    | 'sell'
    | 'auths'
    | 'assets'
    | TIconFromIconfontList;
} & IconComponentProps;

export const IconFromIconfontCN = createFromIconfontCN({
  scriptUrl: AppConfig.iconfontScriptUrl, // 在 iconfont.cn 上生成
});

export const Icons = memo((props: IconProps) => {
  const { type, component, ...last } = props;
  if (type) {
    if (icons[type]) {
      const ICONComp = icons[type];

      // 使用默认的 @ant-design/icons
      return <ICONComp {...last} />;
    }

    //  使用 iconfont.cn 远链上的
    return <IconFromIconfontCN {...{ type, ...last }} />;
  }

  return component ? (
    // 直接传入
    <Icon {...{ component, ...last }} />
  ) : (
    <></>
  );
});
