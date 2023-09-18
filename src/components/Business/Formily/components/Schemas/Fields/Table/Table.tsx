/* eslint-disable import/no-extraneous-dependencies */
import { useMemo, useCallback } from 'react';

import * as React from 'react';
import { Table } from 'antd';
import type { TableProps, ColumnProps } from 'antd/lib/table';

import type { ISchemaFieldComponentProps, Schema } from '@formily/antd';
import { SchemaField, FormItemShallowProvider } from '@formily/antd';
import { toArr, isArr, FormPath } from '@formily/shared';
import { useDebounceWatch } from '@/foundations/hooks';

import './index.less';

export type CustomizeTableProps = {
  className?: string;
  defaultValue?: any[];
  autoHideFooterNodeWhenLimit?: boolean;
  tableProps?: Omit<TableProps<any>, 'columns' | 'dataSource'>;
  operationProps?: ColumnProps<any>;
  formatTableColumns?: (column: any[]) => any[];
  renderOperation?: (params: {
    index: number;
    currentItemData: any;
    mutators: ISchemaFieldComponentProps['mutators'];
    add: (defValue?: any[]) => void;
    remove: () => void;
    moveDown: () => void;
    moveUp: () => void;
  }) => React.ReactNode;
  renderHeader?: (params: {
    add: () => void;
    editable: boolean;
    mutators: ISchemaFieldComponentProps['mutators'];
  }) => React.ReactNode;
  renderFooter?: (params: {
    add: () => void;
    editable: boolean;
    mutators: ISchemaFieldComponentProps['mutators'];
  }) => React.ReactNode;
};

/**
 * 基于 https://github.com/alibaba/uform/blob/master/packages/antd/src/fields/table.tsx 改造
 */
export const TableField = (props: ISchemaFieldComponentProps & CustomizeTableProps) => {
  const { value, schema, className, editable, path, mutators } = props;
  const {
    tableProps = {},
    autoHideFooterNodeWhenLimit = false,
    operationProps = {},
    defaultValue,
    formatTableColumns,
    renderOperation,
    renderHeader,
    renderFooter,
  } = schema.getExtendsComponentProps() as CustomizeTableProps;
  const dataSource = toArr(value);

  const onAdd = useCallback(
    (defValue?: any[]) => {
      const items = Array.isArray(schema.items)
        ? schema.items[schema.items.length - 1]
        : schema.items;

      if (items && dataSource.length < (schema.maxItems || 100000)) {
        mutators.push(defValue || items.getEmptyValue());
      }
    },
    [dataSource.length, mutators, schema.items, schema.maxItems],
  );

  const renderColumns = (items: Schema) =>
    items.mapProperties((itemColumnProps, key) => {
      const itemProps = {
        ...itemColumnProps.getExtendsItemProps(),
        ...itemColumnProps.getExtendsProps(),
      };

      return {
        title: itemColumnProps.title,
        ...itemProps,
        visible: itemColumnProps.display ?? itemColumnProps.visible,
        key,
        dataIndex: key,
        render: (_: any, record: any, index: number) => {
          const newPath = FormPath.parse(path).concat(index, key);

          // https://github.com/alibaba/formily/blob/ef9bc68ec1518218d74071f55d94d42b443e2951/packages/antd-components/src/array-table/index.tsx#L73
          return (
            <FormItemShallowProvider key={newPath.toString()} label={undefined}>
              {/* <SchemaField path={newPath} schema={{ editable, ...itemColumnProps } as Schema} /> */}
              <SchemaField path={newPath} schema={itemColumnProps} />
            </FormItemShallowProvider>
          );
        },
      };
    });

  let columns = !schema.items
    ? []
    : isArr(schema.items)
    ? schema.items.reduce((buf, items) => buf.concat(renderColumns(items) as any), [])
    : renderColumns(schema.items);

  columns = columns.filter((item) => item.visible === undefined);

  if (editable && renderOperation) {
    columns.push({
      title: '操作',
      dataIndex: 'operations',
      ...operationProps,
      render: (_: any, currentItemData: any, index: number) => (
        <>
          {renderOperation({
            index,
            mutators,
            currentItemData,
            add: onAdd,
            remove: () => mutators.remove(index),
            moveDown: () => mutators.remove(index),
            moveUp: () => mutators.remove(index),
          })}
        </>
      ),
    });
  }

  if (formatTableColumns) {
    columns = formatTableColumns(columns);
  }

  const renderHeaderMemo = useMemo(
    () => renderHeader && renderHeader({ add: onAdd, mutators, editable }),
    [renderHeader, mutators, editable, onAdd],
  );

  const renderFooterMemo = useMemo(
    () => renderFooter && renderFooter({ add: onAdd, mutators, editable }),
    [renderFooter, mutators, editable, onAdd],
  );

  useDebounceWatch(
    () => {
      defaultValue?.forEach((df) => {
        onAdd(df);
      });
    },
    [defaultValue],
    { immediate: true },
  );

  return (
    <div className={className}>
      {renderHeaderMemo}

      <Table
        pagination={false}
        rowKey={(_, index) => `${index}`}
        className="array-table__field--container"
        {...tableProps}
        columns={columns}
        dataSource={dataSource}
      />

      {autoHideFooterNodeWhenLimit && schema.maxItems && dataSource.length >= schema.maxItems
        ? null
        : renderFooterMemo}
    </div>
  );
};
