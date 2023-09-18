import { Modal, Radio } from 'antd';

import sampleImg from '../image/sample.png';
import complexImg from '../image/complex.png';
import styles from '../index.less';

export const Sample = ({ sampleType, onChangeSample, ...sampleOpt }: any) => {
  return (
    <Modal {...sampleOpt}>
      <Radio.Group value={sampleType} onChange={onChangeSample} className={styles.chooseButton}>
        <Radio value="ENTIRE">全品类版</Radio>
        <Radio value="SIMPLE">简洁版</Radio>
      </Radio.Group>
      <div className={styles.sample}>
        <div className={styles.perDiv}>
          <img src={complexImg} alt="" />
        </div>
        <div className={styles.perDiv}>
          <img src={sampleImg} alt="" />
        </div>
      </div>
    </Modal>
  );
};
