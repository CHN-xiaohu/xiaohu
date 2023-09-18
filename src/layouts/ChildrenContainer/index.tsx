import * as React from 'react';
import { connect } from 'umi';
import NProgress from 'nprogress';

import './index.less';

type IProps = {
  loading: { global: boolean };
  location: Location;
};

NProgress.configure({ showSpinner: false });

// 储存旧的页面路径，用于切换的时候比对
let oldPathname = '';

export const loadPageChange = (loading: boolean, pathname: string) => {
  if (oldPathname !== pathname) {
    // 页面开始加载时调用 start 方法
    NProgress.start();

    if (!loading) {
      // loading.global 为 false 时表示加载完毕
      requestAnimationFrame(() => NProgress.done());

      oldPathname = pathname; // 将新页面的 href 值赋值给 currHref
    }
  }
};

/**
 * 用来防止 umi 在不同 layout 切换的时候造成了 rerender
 *
 * @see https://github.com/umijs/umi/issues/2218
 */
function ChildrenContainer({ children, loading, location }: React.PropsWithChildren<IProps>) {
  loadPageChange(loading.global, location.pathname);

  return <>{children}</>;
}

export default connect(({ loading }: IProps) => ({ loading }))(ChildrenContainer);
