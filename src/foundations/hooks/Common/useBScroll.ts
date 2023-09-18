/* eslint-disable react-hooks/exhaustive-deps */
import type { RefObject } from 'react';
import { useEffect, useRef, useCallback } from 'react';

import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
// import ObserveDom from '@better-scroll/observe-dom';

import { isObj } from '@/utils';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
// BScroll.use(ObserveDom);

const DIRECTION_V = 'vertical';
const DIRECTION_H = 'horizontal';

export type IBScrollParams = {
  scrollContainerRef: RefObject<HTMLDivElement>;
  options?: BScroll['options'];
  direction?: 'vertical' | 'horizontal';
  listenScrolls?: {
    scroll: () => void;
  };
  onInit?: () => void;
};

/**
 * @ref https://github.com/didi/cube-ui/blob/dev/src/components/scroll/scroll.vue
 */
export const useBScroll = ({
  direction = DIRECTION_V,
  listenScrolls,
  scrollContainerRef,
  options,
  onInit,
}: IBScrollParams) => {
  const scrollInstance = useRef<BScroll>(null);

  const initScroll = useCallback(() => {
    if (!scrollContainerRef.current || scrollInstance.current) {
      return;
    }

    const newOptions = {
      scrollX: direction === DIRECTION_H,
      scrollY: direction === DIRECTION_V,

      // @see https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#probetype
      probeType: listenScrolls ? 3 : 1,
      scrollbar: {
        fade: true,
        interactive: true,
      },
      bounce: false,
      observeDom: true,
      ...options,
      momentum: false,
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
        ...((isObj(options?.mouseWheel) && options?.mouseWheel) || {}),
      },
    };

    (scrollInstance as any).current = new BScroll(scrollContainerRef.current, newOptions as any);
  }, [options, listenScrolls]);

  useEffect(() => {
    if (scrollContainerRef.current && !scrollInstance.current) {
      onInit?.();

      initScroll();
    }

    return () => {
      // eslint-disable-next-line no-unused-expressions
      scrollInstance.current?.destroy();
    };
  }, [scrollContainerRef]);

  return {
    scrollInstance: scrollInstance.current,
  };
};
