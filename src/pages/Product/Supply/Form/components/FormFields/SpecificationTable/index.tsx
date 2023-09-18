import { useCallback, useMemo } from 'react';

import { Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';

import type { ISchemaFieldComponentProps, Schema } from '@formily/antd';
import { createEffectHook } from '@formily/antd';

// import styles from './index.less';

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

import { expandColumnsFieldPropsMap } from '../../../Utils/TableColumns';

export const expandColumnsMap = () => ({
  image: 'SKU 图片',
  minimumSale: '起售数量',
  supplyPrice: '供货价 (元)',
  suggestSalePrice: '建议零售价 (元)',
  lowerSalePrice: '最低零售价 (元)',
  stock: '商品库存',
});

// 用于比对最小值
export const generateContrastTableInputMinimumValues = () => ({
  minimumSale: 0,
  supplyPrice: 0,
  suggestSalePrice: 0,
  lowerSalePrice: 0,
  stock: 0,
});

export type SpecificationTableProps = {
  value: any;
  columns: ColumnProps<any>[];
  dataSource: any[];
  initialValue: ProductModelState['initialValues']['products'];
  parentFormPath: string;
  onBatchSetting: (values: IInitBatchSettingValues, selectedRowIndexs: string[]) => void;
};

// 批量设置
const ON_SET_SPECIFICATION_TABLE_BATCH_SETTING = 'ON_SET_SPECIFICATION_TABLE_BATCH_SETTING';
export const onSpecificationTableBatchSetting$ = createEffectHook<{
  selectedRowIndexs: number[];
  columnInputValues: { [k in keyof ReturnType<typeof expandColumnsMap>]: number };
}>(ON_SET_SPECIFICATION_TABLE_BATCH_SETTING);

const Main = ({
  value,
  schema,
  path: parentFormPath,
  form,
  editable,
  mutators,
}: ISchemaFieldComponentProps) => {
  const {
    columns = [],
    onBatchSetting,
    initialValue,
  } = schema.getExtendsComponentProps() as SpecificationTableProps;

  const handleBatchSetting = useCallback((columnInputValues, selectedRowIndexs) => {
    onBatchSetting?.(columnInputValues, selectedRowIndexs);

    form.notify(ON_SET_SPECIFICATION_TABLE_BATCH_SETTING, {
      selectedRowIndexs,
      columnInputValues,
    });
  }, []);

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

  const fullTableColumns = useMemo(
    () =>
      newColumns.concat(
        renderExpandColumns({
          parentFormPath,
          itemsSchema: schema.items as Schema,
          getExpandColumnsMap: expandColumnsMap,
        }),
      ),
    [schema.items, newColumns],
  );

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
