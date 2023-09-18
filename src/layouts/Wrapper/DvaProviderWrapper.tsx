// eslint-disable-next-line import/no-extraneous-dependencies
import { useMemo } from 'react';
import { getDvaApp } from 'umi';

/**
 * 用于封装 hooks 的时候，在 ReactDOM.render 的时候，做外层的包装，以包装一致的全局状态
 */
export function DvaProviderWrapper({ children }: React.PropsWithChildren<{}>) {
  // eslint-disable-next-line no-underscore-dangle
  const content = useMemo(() => getDvaApp()._getProvider(() => children), [children]);

  return (
    // eslint-disable-next-line no-underscore-dangle
    <>{content}</>
  );
}
