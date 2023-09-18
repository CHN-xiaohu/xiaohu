import { useCallback } from 'react';

import { Spin } from 'antd';
import { useRequest } from 'umi';
import FileSaver from 'file-saver';

import { useModal } from '@/foundations/hooks';

import styles from './index.less';

import { getMiniprogramProductQR } from '../../Api';

type Props = {
  name: string;
  id: string;
};

const RenderMiniprogramProductQR = ({ name, id }: Props) => {
  const { loading, data } = useRequest(() => getMiniprogramProductQR(id), {
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

export const useMiniprogramProductQR = () => {
  const { openModal, modalElement } = useModal();

  const openMiniprogramProductQR = useCallback((props: Props) => {
    openModal({
      title: '商品二维码',
      footer: null,
      children: <RenderMiniprogramProductQR {...props} />,
    });
  }, []);

  return {
    openMiniprogramProductQR,
    MiniprogramProductQRElement: modalElement,
  };
};
