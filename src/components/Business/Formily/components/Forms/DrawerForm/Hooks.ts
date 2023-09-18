import { useCallback } from 'react';
import { useMakeVisibleHooks } from '@/foundations/hooks';

import type { DrawerFormProps } from './DrawerForm';
import { DrawerForm } from './DrawerForm';

export type UseDrawerFormProps<T> = {
  //
} & Omit<DrawerFormProps<T>, 'visible'>;

export const useDrawerForm = <T extends any>(defaultProps?: UseDrawerFormProps<T>) => {
  const {
    open,
    close: closeDrawerForm,
    renderElement: drawerFormElement,
    props,
  } = useMakeVisibleHooks<DrawerFormProps>({ ComponentElement: DrawerForm, defaultProps });

  const openDrawerForm = useCallback(
    (newProps?: Partial<UseDrawerFormProps<T>>) => {
      open(newProps);
    },
    [open],
  );

  return {
    props,
    openDrawerForm,
    closeDrawerForm,
    drawerFormElement,
  };
};
