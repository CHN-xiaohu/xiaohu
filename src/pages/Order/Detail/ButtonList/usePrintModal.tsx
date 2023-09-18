import { useModal } from '@/foundations/hooks';
import { history } from 'umi';

export const usePrintModal = () => {
  const handleSetUp = () => {
    history.push('/system/receiptPrinter');
  };

  const { openModal, modalElement } = useModal({
    title: '提示',
    onOk: handleSetUp,
    okText: '前往设置',
    cancelText: '暂不设置',
  });

  return {
    openPrintModal: openModal,
    modalElement,
  };
};
