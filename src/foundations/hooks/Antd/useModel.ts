import { useCallback } from 'react';
// import { Modal } from 'antd';
// import { ModalProps } from 'antd/lib/modal';

import type { ModalWrapperProps } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';
import { ModalWrapper } from '@/components/Business/Formily/components/Forms/ModalForm/ModalWrapper';

import { useMakeVisibleHooks } from './useMakeVisibleHooks';

type Props = Omit<ModalWrapperProps, 'visible'> & { children?: React.ReactNode };

export const useModal = (defaultProps?: Props, deps?: any[]) => {
  const {
    open,
    close: closeModal,
    renderElement: modalElement,
    props,
  } = useMakeVisibleHooks<Props>({
    ComponentElement: ModalWrapper,
    defaultProps,
    deps,
  });

  const openModal = useCallback(
    (newProps?: Props) => {
      open(newProps);
    },
    [open],
  );

  return {
    props,
    openModal,
    closeModal,
    modalElement,
  };
};
