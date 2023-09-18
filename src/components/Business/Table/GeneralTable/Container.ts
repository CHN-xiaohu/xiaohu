/* eslint-disable react-hooks/exhaustive-deps */
import { createContainer } from 'unstated-next';
import { useRef, useCallback } from 'react';
import { useImmer } from 'use-immer';
import type { TableProps, ColumnProps } from 'antd/lib/table';
import type { useTable } from '@/foundations/hooks';

export type UseTableStoreProps = {
  containerRef?: React.RefObject<HTMLDivElement>;
  size?: TableProps<any>['size'];
};

type UseTableReturnType = ReturnType<typeof useTable>;

export type TableActions<T = any> = {
  // 由 useTable 赋予的能力
  reload: UseTableReturnType['reload'];
  refresh: UseTableReturnType['refresh'];
  addSearchParamsAndRefresh: UseTableReturnType['addSearchParamsAndRefresh'];
  searchSubmit: UseTableReturnType['searchSubmit'];
  dataSource: T[];
  // setDataSource: UseTableReturnType['setDataSource'];
  setDataSource: (callback: (data: T[]) => void) => void;
  setUseTableHookState: UseTableReturnType['setUseTableHookState'];

  selectedRows: T[];
  selectedRowKeys: React.Key[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  clearTableSelected: Function;

  // 用于工具栏的列设置
  tableColumns: (ColumnProps<T> & { show: boolean; fixed: 'left' | 'right' | undefined })[];
};

export type UseTableStoreState = {
  containerRef: UseTableStoreProps['containerRef'];
  tableSize: UseTableStoreProps['size'];
  tableColumns: (ColumnProps<any> & {
    visible?: boolean;
    show: boolean;
    fixed: 'left' | 'right' | undefined;
    index: number;
  })[];
};

function useTableStore(props: UseTableStoreProps = {}) {
  const [state, setState] = useImmer<UseTableStoreState>({
    containerRef: undefined,
    tableSize: props.size || 'large',
    tableColumns: [],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<TableActions>({} as any);

  // 列设置， 全选 or 全部取消勾选
  const setTableColumnsSelectAllOrCancelAll = useCallback((show = true) => {
    setState((draft) => {
      draft.tableColumns.forEach((item) => {
        item.show = show;
      });
    });
  }, []);

  const resetTableColumnsValue = useCallback((newTableColumnsValue?: ColumnProps<any>[]) => {
    setState((draft) => {
      draft.tableColumns = ((newTableColumnsValue as any[]) || draft.tableColumns || []).map(
        (item, index) => ({
          fixed: undefined,
          ...item,
          index,
          key: item.key || `${item.dataIndex}_${index}`,
          show: true,
        }),
      );
    });
  }, []);

  return {
    actions: actionsRef.current,
    actionsRef,
    containerRef,
    state,
    setState,
    setTableColumnsSelectAllOrCancelAll,
    resetTableColumnsValue,
  };
}

export const Container = createContainer<ReturnType<typeof useTableStore>, UseTableStoreProps>(
  useTableStore,
);
