import { useMemo } from 'react';

import { Table, Tooltip } from 'antd';
import type { ColumnProps } from 'antd/lib/table';

import type { ISchemaFieldComponentProps, Schema } from '@formily/antd';

import type { ProductModelState } from 'umi';

import { useWatch } from '@/foundations/hooks';

import type {
  //
  IInitBatchSettingValues,
} from '@/pages/Product/Manager/Form/components/FormFields/SpecificationTable/BatchSetting';
import {
  //
  SpecificationTableBatchSetting,
} from '@/pages/Product/Manager/Form/components/FormFields/SpecificationTable/BatchSetting';

import { skuCacheManage } from '@/pages/Product/Manager/Form/Utils/Specification';

import { useSpecificationTable } from '@/pages/Product/Manager/Form/components/FormFields/SpecificationTable/useTable';
import { renderExpandColumns } from '@/pages/Product/Manager/Form/components/FormFields/SpecificationTable';
import { usePersistFn } from 'ahooks';

export type SpecificationTableProps = {
  value: any;
  columns: ColumnProps<any>[];
  dataSource: any[];
  initialValue: ProductModelState['initialValues']['products'];
  parentFormPath: string;
  expandColumnsMap: () => AnyObject;
  expandColumnsFieldPropsMap: () => AnyObject;
  notRequiredFileds?: string[];
  onBatchSetting: (values: IInitBatchSettingValues, selectedRowIndexs: string[]) => void;
};

const Main = ({
  value,
  schema,
  path: parentFormPath,
  editable,
  mutators,
}: ISchemaFieldComponentProps) => {
  const {
    columns = [],
    initialValue,
    onBatchSetting,
    expandColumnsFieldPropsMap,
    expandColumnsMap,
    notRequiredFileds,
  } = schema.getExtendsComponentProps() as SpecificationTableProps;

  const handleBatchSetting = usePersistFn((columnInputValues, selectedRowIndexs) => {
    onBatchSetting?.(columnInputValues, selectedRowIndexs);
  });

  const {
    dataSource,
    newColumns,
    rowSelection,
    handleTableChange,
    handleBatchSettingByHooks,
  } = useSpecificationTable({
    value,
    initialValue,
    columns,
    editable,
    skuCacheManage,
    onBatchSetting: handleBatchSetting,
  });

  useWatch(
    () => {
      if (initialValue?.length) {
        mutators.change(dataSource);
      }
    },
    [dataSource],
    { isAreEqual: true },
  );

  const tipsList = ['purchasePrice', 'vipPurchasePrice', 'storeSupplyPrice'] as any;

  const fullTableColumns = useMemo(() => {
    const renderExpandColumnsResult = renderExpandColumns({
      parentFormPath,
      itemsSchema: schema.items as Schema,
      getExpandColumnsMap: expandColumnsMap,
      notRequiredFileds,
    }).map((column) => {
      // 劫持既定的 render 函数
      if (column.dataIndex === 'minimumSale') {
        column.render = (v: number) => (
          <a className="a-cursor--inherit">{Number(v) === 0 ? '不限' : v}</a>
        );
      } else if (column.dataIndex === 'supplyPrice' || column.dataIndex === 'stock') {
        column.render = (v: number) => <a className="a-cursor--inherit">{v}</a>;
      } else {
        // eslint-disable-next-line prefer-destructuring
        const oldRender = column.render;
        /**
         *
         * 采购价 店铺供货价 （提示：最低价~最高价）
         * 零售价 (提示：建议零售价~最低零售价)
         */

        column.render = (...arg: any) => {
          return (
            <Tooltip
              trigger={['focus']}
              title={
                <>
                  <p>
                    {!tipsList.includes(column.dataIndex) ? '建议零售价：' : '最高价：'}
                    {arg[1].suggestSalePrice}
                  </p>
                  <p>
                    {!tipsList.includes(column.dataIndex) ? '最低零售价：' : '最低价：'}
                    {!tipsList.includes(column.dataIndex)
                      ? arg[1].lowerSalePrice
                      : arg[1].supplyPrice}
                  </p>
                </>
              }
            >
              {oldRender(...arg)}
            </Tooltip>
          );
        };
      }

      return column;
    });

    return newColumns.concat(renderExpandColumnsResult);
  }, [schema.items, newColumns]);

  return (
    <div style={{ display: !dataSource.length ? 'none' : '' }}>
      {editable && (
        <SpecificationTableBatchSetting
          expandColumnsFieldPropsMap={expandColumnsFieldPropsMap()}
          onBatchSetting={handleBatchSettingByHooks}
        />
      )}

      <Table
        bordered
        rowKey="id"
        pagination={false}
        className="sku-table-container"
        {...{
          dataSource,
          columns: fullTableColumns,
          rowSelection,
          onChange: handleTableChange as any,
        }}
      />
    </div>
  );
};

Main.isFieldComponent = true;

export const SpecificationTable = Main;
