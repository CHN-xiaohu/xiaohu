/**
 * Ant Design Pro v5 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import type { MenuDataItem, BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import { useEffect } from 'react';
import * as React from 'react';
import { Link, history } from 'umi';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { Icons } from '@/components/Library/Icon';

import { isArr } from '@/utils';

import { Header } from '../components/GlobalHeader/Header';
import { loadPageChange } from '../ChildrenContainer';

import './index.less';

export type BasicLayoutProps = {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
} & ProLayoutProps;
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: Record<string, MenuDataItem>;
};

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const { collapsed: collapsedValue, menu: menuData = [], menuLoading } = useStoreState('app');
  const { setting } = useStoreState('setting');
  const { children, location } = props;

  const { global: globalLoading } = useStoreState('loading' as any);
  loadPageChange(globalLoading, props.location?.pathname || '');

  useEffect(() => {
    // 执行一些初始化的处理
    window.$fastDispatch(({ app }) => app.initialize);
  }, []);

  useEffect(() => {
    // 路由切换后，自动滚动到顶部
    if (!props.route.notAutoScrollTo) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [location?.pathname]);

  /**
   * init variables
   */
  const handleMenuCollapse = (collapsed: boolean): void => {
    window.$fastDispatch((model) => model.app.updateState, { collapsed });
  };

  const realMenuData = React.useMemo(() => (isArr(menuData) && menuData.length ? menuData : []), [
    menuData,
  ]);

  return (
    <ProLayout
      menuHeaderRender={(logoDom, titleDom) => (
        <a onClick={() => history.push('/')}>
          {logoDom}
          {titleDom}
        </a>
      )}
      collapsed={collapsedValue}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return (
          <Link to={menuItemProps.path}>
            <Icons type={`anticon-${menuItemProps.source}` as 'delete'} />
            {defaultDom}
          </Link>
        );
      }}
      menuDataRender={() =>
        realMenuData.map((item) => ({
          ...item,
          icon: <Icons type={`anticon-${(item as AnyObject).source}` as 'delete'} />,
        }))
      }
      headerRender={() => <Header />}
      {...setting}
      menu={{
        loading: menuLoading,
      }}
      {...props}
    >
      <div id="app-main-body">{children}</div>
    </ProLayout>
  );
};

export default BasicLayout;
