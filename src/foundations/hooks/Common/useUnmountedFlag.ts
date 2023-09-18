import { useRef } from 'react';

import { useUnmount } from 'ahooks';

export const useUnmountedFlag = () => {
  // 卸载标记
  const unmountedFlag = useRef(false);

  useUnmount(() => {
    unmountedFlag.current = true;
  });

  return {
    unmountedFlag,
  };
};
