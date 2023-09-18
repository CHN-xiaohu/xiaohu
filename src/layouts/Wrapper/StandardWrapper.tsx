import * as React from 'react';

import { DvaProviderWrapper } from './DvaProviderWrapper';
import { LocaleWrapper } from './LocaleWrapper';

/**
 * 用于封装 hooks 的时候，在 ReactDOM.render 的时候，做外层的包装
 * 这里整合了载入 dva、antd 的全局化配置、i18n 的多语言配置等等
 */
export function StandardWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <DvaProviderWrapper>
      <LocaleWrapper>{children}</LocaleWrapper>
    </DvaProviderWrapper>
  );
}
