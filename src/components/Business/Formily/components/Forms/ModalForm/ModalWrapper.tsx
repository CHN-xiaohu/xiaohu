import '../Common/index.less';

import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Modal } from 'antd';
import { nanoid } from 'nanoid';
import type { ModalProps } from 'antd/lib/modal';

import { isFn } from '@/utils';

import { useAppMainBodySamaSizeLayerFormStyle } from '../Common';

export type ModalWrapperProps = {
  isNativeAntdStyle?: boolean;
  children?: React.ReactNode | (() => React.ReactNode);
  footer?: ((props: Pick<ModalProps, 'onOk' | 'onCancel'>) => React.ReactNode) | false | null;
} & ModalProps;

export const ModalWrapper = React.memo(
  ({ visible, title, footer, ...props }: ModalWrapperProps) => {
    const modalId = React.useMemo(() => nanoid(), []);

    const appMainBodySamaSizeLayerFormStyle = useAppMainBodySamaSizeLayerFormStyle(props || {}, {
      reduceHeight: footer !== false ? 53 : 0,
    });

    const handleCancelWrap = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        props.onCancel?.(e);

        // 滚动回顶部
        requestAnimationFrame(() => {
          document
            .querySelector(`.layer-form-${modalId}`)
            ?.querySelector('.ant-modal-body')
            ?.scrollTo({ top: 0 });
        });
      },
      [modalId, props],
    );

    const realFooter = React.useMemo(
      () => (isFn(footer) ? footer({ onOk: props.onOk, onCancel: handleCancelWrap }) : footer),
      [footer, handleCancelWrap, props.onOk],
    );

    return (
      <Modal
        {...{
          ...props,
          className: classNames('layer-form-wrap', `layer-form-${modalId}`, props?.className),
          ...(props.isNativeAntdStyle ? {} : appMainBodySamaSizeLayerFormStyle),
          id: modalId,
          visible,
          title,
          footer: realFooter,
          onCancel: handleCancelWrap,
        }}
      >
        {props.children}
      </Modal>
    );
  },
);
