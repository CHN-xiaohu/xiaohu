import Swiper from 'react-id-swiper';
import 'swiper/swiper.less';

import styles from './style.less';

import type { ListType } from '..';

const dic = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export default ({
  dataList = [],
  width = 750,
  height = 360,
}: {
  dataList: ListType;
  [key: string]: any;
}) => {
  const params = {
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true,
    },
    shouldSwiperUpdate: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  const ratio = 750 / 400;

  const children = dataList.map((e: any, i: number) =>
    e && e.picUrl ? (
      <img key={dic[i]} className={styles.img} src={e.picUrl} alt={dic[i]} />
    ) : (
      <div key={dic[i]} className={`${styles.center} ${styles.img}`}>
        {dic[i]}({width}x{height})
      </div>
    ),
  );

  return (
    <div
      className={styles.swipper}
      style={{
        width: `${width / ratio}px`,
        border: '1px solid #ddd',
        // height: `${height / ratio}px`,
      }}
    >
      <Swiper {...params} containerClass={styles.wrapper}>
        {children}
      </Swiper>
    </div>
  );
};
