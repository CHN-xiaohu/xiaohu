import { useStoreState } from '@/foundations/Model/Hooks/Model';

import type { ISchemaFieldComponentProps } from '@formily/antd';
import { modelNamespace } from '@/pages/PcColumn/Constant';

import styles from '../index.less';

export const LeftImg = (props: ISchemaFieldComponentProps) => {
  const { productAdvImgType } = useStoreState(modelNamespace as 'pcColumn');

  const { value } = props;

  return (
    <div className={styles.leftImg}>
      {value ? (
        <img className={styles.leftImg} src={value} alt="" />
      ) : (
        <div className={styles.leftImg}>
          左侧广告
          <br />
          {productAdvImgType === 'PC_PRODUCT_TEMPLATE_TWO' ? '（227x654）' : '（480x700）'}
        </div>
      )}
    </div>
  );
};
