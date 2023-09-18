import { useCallback } from 'react';

import { Spin } from 'antd';
import { useRequest } from 'umi';
import FileSaver from 'file-saver';

import { useModal } from '@/foundations/hooks';

import styles from './index.less';

import { getMiniProgramCouponQR } from '../Api';

type Props = {
  name: string;
  id: string;
};

const RenderMiniProgramCouponQR = ({ name, id }: Props) => {
  const { loading, data } = useRequest(() => getMiniProgramCouponQR(id), {
    refreshDeps: [id],
    formatResult: (res) => res,
  });

  const downLoadImage = () => {
    FileSaver.saveAs(data!, `${name}.jpg`);
  };

  return (
    <Spin spinning={loading}>
      <div className={styles.wrapper}>
        <div>{name}</div>
        <img className={styles.image} src={data} alt={name} />
        <a onClick={downLoadImage}>下载二维码</a>
      </div>
    </Spin>
  );
};

export const useMiniProgramCouponQR = () => {
  const { openModal, modalElement } = useModal();

  const openMiniProgramCouponQR = useCallback((props: Props) => {
    openModal({
      title: '优惠券二维码',
      footer: null,
      isNativeAntdStyle: true,
      children: <RenderMiniProgramCouponQR {...props} />,
    });
  }, []);

  return {
    openMiniProgramCouponQR,
    MiniProgramCouponQRElement: modalElement,
  };
};
