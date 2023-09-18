import * as React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/es/modal';

export const HookModal: React.FC<ModalProps & { content?: React.ReactNode }> = (props) => {
  const { children, content, ...lastProps } = props;

  return <Modal {...lastProps}>{content || children}</Modal>;
};
