import type { FormInstance } from 'antd/lib/form';

import { useRef } from 'react';

export const useSkuFormInstanceRef = <V extends Record<string, any>>() => {
  const getFormInstanceRef = useRef<
    FormInstance<V> & { handleAddCartOrBuy: (t: 'addCart' | 'buy') => () => Promise<any> }
  >({} as any);

  return {
    getFormInstanceRef,
  };
};
