import styles from './style.less';

import type { ListType } from '..';

type Props = {
  dataList: ListType;
  size?: number;
};

const placeholders = ['A', 'B', 'C', 'D', 'E', 'A1', 'B1', 'C1', 'D1', 'E1'];

export default ({ dataList = Array(10).fill({}) }: Props) => {
  const renderItem = () =>
    Array(dataList.length)
      .fill({})
      .map((e, i) => (
        <div className={styles.item} key={placeholders[i]}>
          {dataList[i] && dataList[i].picUrl ? (
            <>
              <div className={styles.img}>
                <img
                  className={styles.img}
                  src={dataList[i].picUrl || 'textList'}
                  alt={placeholders[i]}
                />
              </div>
              <div className={styles.title}>{dataList[i].title || ' '}</div>
            </>
          ) : (
            <div className={styles.img}>{placeholders[i]}</div>
          )}
          {dataList[i] && dataList[i].label && (
            <div className={styles.bubble}>{dataList[i].label}</div>
          )}
        </div>
      ));
  return <div className={styles.wrapper}>{renderItem()}</div>;
};
