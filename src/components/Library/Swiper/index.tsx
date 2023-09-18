import React from 'react';
import type { ReactIdSwiperProps, SwiperRefNode } from 'react-id-swiper';
import OriginSwiper from 'react-id-swiper';

import './index.less';

export type { SwiperRefNode, ReactIdSwiperProps, SwiperInstance } from 'react-id-swiper';

export const Swiper = React.forwardRef<SwiperRefNode, ReactIdSwiperProps>((props, ref) => {
  return <OriginSwiper {...props} ref={ref} />;
});
