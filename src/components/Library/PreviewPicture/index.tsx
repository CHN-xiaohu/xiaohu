import { useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { Modal } from 'antd';
import type { ModalProps } from 'antd/es/modal';

import { createReactDomContainer } from '@/utils';

import styles from './index.less';

import { BackgroundImage } from '../Image/BackgroundImage';

type Props = {
  src: string;
  subtitle?: string;
} & ModalProps;

// 当前只允许开启一个资源管理面板
const ContainerNode = createReactDomContainer('usePreviewPicture');

// 图片预览
export const PreviewPicture = (props: Props) => {
  const { subtitle, src, ...other } = props;

  return (
    <Modal
      {...other}
      width="89vw"
      className={classNames(
        styles.warpper,
        subtitle ? styles.existSubtitle : styles.notExistSubtitle,
      )}
      cancelButtonProps={{
        style: { display: 'none' },
      }}
      okButtonProps={{
        shape: 'round',
      }}
      zIndex={1009}
      okText=" 关  闭 "
    >
      <>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}

        <div className={styles.image}>
          <BackgroundImage
            src={src}
            style={{
              width: '100%',
              flex: '1 1 auto',
            }}
          />
        </div>
      </>
    </Modal>
  );
};

export const usePreviewPicture = () => {
  const [state, setState] = useState<Props>({} as any);

  const open = useCallback((props: Omit<Props, 'visible'>) => {
    if (!props.title) {
      props.title = '图片预览';
    }

    setState(() => ({ ...props, visible: true }));
  }, []);

  const close = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  // 传递 props, 而不是直接使用 state，减少因为 state 变化而重新创建 render
  const render = useCallback(
    (props: Props) => {
      ReactDOM.render(
        <PreviewPicture {...{ onOk: close, onCancel: close, ...props }} />,
        ContainerNode,
      );
    },
    [close],
  );

  useEffect(() => {
    render(state);
  }, [render, state]);

  return {
    open,
    close,
  };
};
