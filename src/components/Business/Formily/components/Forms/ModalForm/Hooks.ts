import { useCallback } from 'react';
import { useMakeVisibleHooks } from '@/foundations/hooks';

import type { ModalFormProps } from './Form';
import { ModalForm } from './Form';

export type UseModalFormProps<T> = {
  //
} & Omit<ModalFormProps<T>, 'visible'>;

export const useModalForm = <T extends any>(defaultProps?: UseModalFormProps<T>, deps?: any[]) => {
  const {
    open,
    close: closeModalForm,
    renderElement: ModalFormElement,
    props,
  } = useMakeVisibleHooks<ModalFormProps>({
    ComponentElement: ModalForm,
    defaultProps,
    deps,
    isAutoSetOnOkFunc: false,
  });

  const openModalForm = useCallback(
    (newProps?: Partial<UseModalFormProps<T>>) => {
      open(newProps);

      return Promise.resolve();
    },
    [open],
  );

  return {
    props,
    openModalForm,
    closeModalForm,
    ModalFormElement,
  };
};
