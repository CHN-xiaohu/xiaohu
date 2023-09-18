import { useEffect, useCallback, memo, useMemo } from 'react';
import { Table, Card } from 'antd';
import { useImmer } from 'use-immer';
import classNames from 'classnames';

import type { TableProps } from 'antd/lib/table';
import type { TableRowSelection } from 'antd/lib/table/interface';

import type { UseTableOptions, FnParams } from '@/foundations/hooks';
import { useZWXExclusiveTable } from '@/foundations/hooks';
import type { SearchFromProps } from '@/components/Business/Formily/components/Forms/SearchForm';
import { SearchFrom } from '@/components/Business/Formily/components/Forms/SearchForm';

import { isObj } from '@spark-build/web-utils';

import type { TableColumnsProps } from './TableColumRender';
import { columRender } from './TableColumRender';

import { Container } from './Container';
import type { TableHeaderProps } from './Header';
import { Header } from './Header';
import type { TableAlertProps } from './components/Alert';

import styles from './index.less';

export * from '@app_components/Business/Formily/Utils/FieldDefaultSchema';
export * from './Container';
export * from './TableColumRender';
export * from './Hooks';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface GeneralTableLayoutProps<V = any, P extends FnParams = FnParams>
  extends Omit<TableHeaderProps<V>, 'actions'> {
  className?: string;
  searchProps?: SearchFromProps<V>;
  tableProps?: Omit<TableProps<V>, 'title' | 'columns'>;
  columns: TableColumnsProps<V>[];
  placeholder?: string;
  bordered?: boolean;
  request: (
    params: P & {
      pageSize?: number;
      current?: number;
      size?: number;
    },
  ) => PromiseResponsePaginateResult;
  useTableOptions?: UseTableOptions;
  tableContainerRef?: React.RefObject<HTMLDivElement>;

  selectedRowsAlertProps?:
    | false
    | 'completelyHidden'
    | (Omit<TableAlertProps<V>, 'selectedRowKeys' | 'selectedRows' | 'onCleanSelected'> & {
        onChange?: TableRowSelection<V>['onChange'];
      });

  getActions?: React.RefObject<TableHeaderProps<V>['actions']>;
}

const Main = memo(
  <V, P extends FnParams = FnParams>({
    bordered,
    className,
    headerTitle,
    // table columns
    columns,
    // 搜索表单
    searchProps,

    // 操作按钮
    defaultAddOperationButtonListProps,
    operationButtonListProps,

    // 选择 row 的组件 Props
    selectedRowsAlertProps = false,

    // 工具栏
    toolBarProps,
    // table 相关
    request,
    useTableOptions,
    tableProps: defaultTableProps,
    // 用于跟外部的 ref 进行握手
    getActions,
    // 表格容器的 ref
    tableContainerRef,
    placeholder,
  }: GeneralTableLayoutProps<V, P>) => {
    const {
      actions,
      actionsRef,
      containerRef,
      state,
      resetTableColumnsValue,
    } = Container.useContainer();
    const {
      addSearchParamsAndRefresh,
      tableProps,
      refresh,
      reload,
      searchSubmit,
      setDataSource,
      setUseTableHookState,
    } = useZWXExclusiveTable<V, P>(request, useTableOptions);

    const [tableState, setTableState] = useImmer({
      selectedRows: [] as V[],
      selectedRowKeys: [] as React.Key[],
    });

    const clearTableSelected = useCallback(() => {
      setTableState((draft) => {
        draft.selectedRows = [];
        draft.selectedRowKeys = [];
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 类 useImperativeHandle 的实现
    useEffect(() => {
      const actionsPower = {
        ...tableState,
        dataSource: tableProps.dataSource,
        addSearchParamsAndRefresh,
        reload,
        refresh,
        setDataSource,
        setUseTableHookState,
        searchSubmit,
        clearTableSelected,
      };

      // 收集封装的各个功能的能力
      actionsRef.current = {
        ...(actionsRef.current || {}),
        ...actionsPower,
      };

      // 跟外部的 ref 进行握手
      if (getActions) {
        (getActions.current as any) = {
          ...(getActions.current || {}),
          ...actionsPower,
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableState, tableProps.dataSource]);

    useEffect(() => {
      resetTableColumnsValue(columns as any);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);

    const handleTableRowSelectionChange = useCallback(
      (keys: React.Key[], rows: V[]) => {
        if (isObj(selectedRowsAlertProps)) {
          selectedRowsAlertProps?.onChange?.(keys, rows);
        }

        setTableState((draft) => {
          draft.selectedRowKeys = keys;
          draft.selectedRows = rows as any;
        });
      },
      [selectedRowsAlertProps, setTableState],
    );

    const tableRowSelection: TableProps<V>['rowSelection'] = {
      selectedRowKeys: tableState.selectedRowKeys,
      onChange: handleTableRowSelectionChange,
    };

    const RenderSearchForm = useMemo(
      () =>
        searchProps && (
          <SearchFrom
            {...{ onSearch: searchSubmit as any, onReset: reload as any, ...searchProps }}
          />
        ),
      [reload, searchProps, searchSubmit],
    );

    const getColumns = useMemo(() => {
      // https://ant.design/components/table-cn/#API
      // 表格元素的 table-layout 属性，设为 fixed 表示内容不会影响列的布局
      // 固定表头/列或使用了 column.ellipsis 时，默认值为 fixed
      let tableLayout = 'auto' as 'auto' | 'fixed';

      const result = state.tableColumns
        .filter((item) => item.show && item.visible !== false)
        .map((column) => {
          if (column.ellipsis || (column as TableColumnsProps<V>).ellipsisProps) {
            tableLayout = 'fixed';
          }

          return {
            render: (value: any, row: any, index: number) =>
              columRender({ column, value, row, index, defaultPlaceholder: placeholder }),
            ...(column as TableColumnsProps<V>),
          };
        });

      return {
        tableLayout,
        columns: result,
      };
    }, [state.tableColumns, placeholder]);

    return (
      <div
        ref={containerRef}
        className={classNames(
          'general-table-class',
          styles.wrapper,
          {
            'general-table-empty-data': !tableProps.dataSource?.length,
          },
          className,
        )}
      >
        {RenderSearchForm}

        <Card
          className={classNames(styles.cardWrapper, 'general-table--content')}
          bodyStyle={{
            padding: 0,
          }}
          bordered={bordered}
        >
          <Header
            {...{
              actions,

              headerTitle,

              toolBarProps,

              defaultAddOperationButtonListProps,
              operationButtonListProps,

              alertProps: isObj(selectedRowsAlertProps)
                ? {
                    ...(selectedRowsAlertProps as any),
                    onCleanSelected: () => {
                      handleTableRowSelectionChange([], []);
                    },
                    selectedRows: tableState.selectedRows,
                    selectedRowKeys: tableState.selectedRowKeys,
                  }
                : selectedRowsAlertProps,
            }}
          />

          <div ref={tableContainerRef}>
            <Table<any>
              size={state.tableSize}
              {...{
                rowKey: 'id',
                rowSelection: isObj(selectedRowsAlertProps) ? tableRowSelection : undefined,
                tableLayout: getColumns.tableLayout,
                ...tableProps,
                ...defaultTableProps,
                columns: getColumns.columns,
              }}
            />
          </div>
        </Card>
      </div>
    );
  },
);

export const GeneralTableLayout = <V extends any = any, P extends FnParams = FnParams>(
  props: GeneralTableLayoutProps<V, P>,
) => (
  <Container.Provider initialState={{}}>
    <Main {...(props as any)} />
  </Container.Provider>
);
