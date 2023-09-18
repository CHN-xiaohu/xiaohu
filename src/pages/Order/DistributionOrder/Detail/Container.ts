import { createContainer } from 'unstated-next';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';

import { useRef, useEffect } from 'react';

import type { PurchaseOrderColumns } from '../../Api';

export type UseOrderDetailStoreProps = {
  //
};

export const formActions = createAsyncFormActions();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useOrderDetailStore(props: UseOrderDetailStoreProps = {}) {
  const [state, setState] = useImmer({
    dataSource: {} as PurchaseOrderColumns,
    reRequestOrderDetail: 0,
    submitSuccess: '',
  });
  const dataSourceRef = useRef<PurchaseOrderColumns>({} as any);

  useEffect(() => {
    dataSourceRef.current = state.dataSource;
  }, [state.dataSource]);

  return {
    state,
    setState,
  };
}

export const Container = createContainer(useOrderDetailStore);
