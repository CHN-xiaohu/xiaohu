import { useCallback } from 'react';

import { useModal } from '@/foundations/hooks';

import DistributionProduct from '../../components/DistributionProduct';

export const tabPaneOpts = [
  {
    title: '未分销',
    state: 1 as 1,
    showSelection: true,
  },
  {
    title: '已分销',
    state: 2 as 2,
    showSelection: false,
  },
];

export const useDistributionProductModal = () => {
  const { openModal, closeModal, modalElement: ModalDistributionProductElement } = useModal({
    bodyStyle: {
      height: '75vh',
    },
    footer: false,
  });

  const openDistributionProduct = useCallback(
    ({ title, supplyId }: { title: string; supplyId: string }) =>
      openModal({
        title: `查看${title}供货商品`,
        destroyOnClose: true,
        children: <DistributionProduct tabPaneOpts={tabPaneOpts} supplyId={supplyId} />,
      }),
    [closeModal],
  );

  return {
    openDistributionProduct,
    closeDistributionProduct: closeModal,
    ModalDistributionProductElement,
  };
};
