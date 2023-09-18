import { useCallback } from 'react';
import { Drawer } from 'antd';

import type { DrawerProps } from 'antd/lib/drawer';

import { useMakeVisibleHooks } from './useMakeVisibleHooks';

const RenderComponent = Drawer;

type Props = Omit<DrawerProps, 'visible'>;

export const useDrawer = (defaultProps?: Props) => {
  const {
    open,
    close: closeDrawer,
    renderElement: drawerElement,
    props,
  } = useMakeVisibleHooks<any>({
    ComponentElement: RenderComponent,
    defaultProps,
  });

  const openDrawer = useCallback(
    (newProps?: Props) => {
      open(newProps);
    },
    [open],
  );

  return {
    props,
    openDrawer,
    closeDrawer,
    drawerElement,
  };
};
