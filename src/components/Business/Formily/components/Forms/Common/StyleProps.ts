import { useMemo } from 'react';
import type { ModalProps } from 'antd/lib/modal';
import { useSize } from 'ahooks';

const paddingSize = 24;
const bodyTop = () =>
  (document.querySelector('#globalHeader')?.clientHeight || 0) + paddingSize + 2;

export const useAppMainBodySamaSizeLayerFormStyle = (
  modalProps: ModalProps,
  opts: { reduceHeight?: number } = {},
) => {
  const calcHeight = useMemo(
    () =>
      [bodyTop(), paddingSize, opts.reduceHeight]
        .filter(Boolean)
        .map((n) => `${n}px`)
        .join(' - '),
    [opts.reduceHeight],
  );

  const AppMainBodyDom = document.querySelector<HTMLElement>('#app-main-body')!;
  const { width = 0 } = useSize(AppMainBodyDom);

  return {
    width,
    maskStyle: {
      zIndex: 900,
    },
    style: {
      top: bodyTop(),
      // 边距
      marginLeft: window.innerWidth - width - paddingSize,
      marginBottom: 0,
      paddingBottom: 0,
      height: `calc(100vh - ${calcHeight})`,
      ...modalProps?.style,
    },
    bodyStyle: modalProps?.bodyStyle,
  };
};
