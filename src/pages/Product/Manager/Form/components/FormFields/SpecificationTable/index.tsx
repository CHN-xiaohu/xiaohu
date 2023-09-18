import { useCallback, useMemo } from 'react';

import { Table } from 'antd';
import type { ColumnProps } from 'antd/lib/table';

import type { ISchemaFieldComponentProps, Schema } from '@formily/antd';
import { SchemaField, FormPath, FormItemShallowProvider, createEffectHook } from '@formily/antd';

// import styles from './index.less';

import type { ProductModelState } from 'umi';

import { useWatch } from '@/foundations/hooks';

import { isObj } from '@/utils';

import { Question } from '@/pages/Dashboard/Workplace';

import type { IInitBatchSettingValues } from './BatchSetting';
import { SpecificationTableBatchSetting } from './BatchSetting';

import { useSpecificationTable } from './useTable';

import { skuCacheManage, expandColumnsFieldPropsMap } from '../../../Utils/Specification';

// 拓展表格
// const expandColumns: any = {
//   sn: '编号',
//   cost_price: '成本价',
//   price: '售价',
//   stock: '库存',
//   weight: '重量(g)',
//   sold_count: '自定义销售量',
// };

export const expandColumnsMap = (isMiniprogramProduct?: boolean) => ({
  image: 'SKU 图片',
  minimumSale: '起售数量',
  factoryPrice: isMiniprogramProduct ? '零售价 (元)' : '成本价 (元)',
  vipPurchasePrice: isMiniprogramProduct ? '销售原价 (元)' : '会员采购价 (元)',
  purchasePrice: '普通采购价 (元)',
  stock: '商品库存',
});

// 用于比对最小值
export const generateContrastTableInputMinimumValues = () => ({
  takeThePrice: 0,
  minimumSale: 0,
  factoryPrice: 0,
  vipPurchasePrice: 0,
  purchasePrice: 0,
  stock: 0,
});

type RenderExpandColumnsProps = {
  parentFormPath: string;
  itemsSchema: Schema;
  notRequiredFields?: string[];
  isMiniprogramProduct?: boolean;
  getExpandColumnsMap: () => AnyObject;
};

export const renderExpandColumns = ({
  parentFormPath,
  itemsSchema,
  // notRequiredFields = [],
  getExpandColumnsMap,
}: RenderExpandColumnsProps) => {
  const expandColumnsMaps = getExpandColumnsMap();
  return itemsSchema.mapProperties((itemColumnProps, column) => {
    const currentColumnOption = isObj(expandColumnsMaps[column])
      ? expandColumnsMaps[column]
      : { title: expandColumnsMaps[column] };

    const className = itemColumnProps.required ? 'ant-form-item-required' : '';

    const item = {
      title: (
        <span className={className}>
          {currentColumnOption.title}

          {/* 问号 */}
          {currentColumnOption.question && (
            <Question
              iconStyle={{ marginLeft: 6 }}
              title=""
              dataSource={[currentColumnOption.question]}
            />
          )}
        </span>
      ),
      dataIndex: column,
      align: 'center',
      width: 145,
      fixed: 'right',
      render: (value: any, _record: any, index: number) => {
        const newPath = FormPath.parse(parentFormPath).concat(index, column);

        return (
          <FormItemShallowProvider key={newPath.toString()} label={undefined}>
            <SchemaField path={newPath} />
          </FormItemShallowProvider>
        );
      },
    } as ColumnProps<any>;

    if (column === 'image') {
      item.width = 160;
    }

    return item;
  });
};

export type SpecificationTableProps = {
  value: any;
  columns: ColumnProps<any>[];
  dataSource: any[];
  initialValue: ProductModelState['initialValues']['products'];
  parentFormPath: string;
  fromProductInfoId?: string;
  isMiniprogramProduct?: boolean;
  expandColumnsObj: Record<string, string>;
  notRequiredFields: string[];
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
    isMiniprogramProduct,
    initialValue,
    fromProductInfoId,
    expandColumnsObj = {},
  } = schema.getExtendsComponentProps() as SpecificationTableProps;

  const handleBatchSetting = useCallback((columnInputValues, selectedRowIndexs) => {
    onBatchSetting?.(columnInputValues, selectedRowIndexs);

    form.notify(ON_SET_SPECIFICATION_TABLE_BATCH_SETTING, {
      selectedRowIndexs,
      columnInputValues,
    });
  }, []);

  const { dataSource, newColumns, rowSelection, handleTableChange, handleBatchSettingByHooks } =
    useSpecificationTable({
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

  const expandColumnsFieldPropsMaps = useMemo(() => {
    const result = expandColumnsFieldPropsMap(isMiniprogramProduct);
    if (isMiniprogramProduct) {
      delete (result as AnyObject).purchasePrice;
      delete (result as AnyObject).stock;
    }

    return result;
  }, [isMiniprogramProduct]);

  const fullTableColumns = useMemo(
    () =>
      newColumns.concat(
        renderExpandColumns({
          parentFormPath,
          itemsSchema: schema.items as Schema,
          isMiniprogramProduct,
          getExpandColumnsMap: () => ({
            ...expandColumnsMap(isMiniprogramProduct),
            ...expandColumnsObj,
          }),
          notRequiredFields: [
            'image',
            'minimumSale',
            ...(isMiniprogramProduct ? ['vipPurchasePrice'] : []),
          ],
        }),
      ),
    [schema.items, newColumns, isMiniprogramProduct],
  );

  return (
    <div style={{ display: !dataSource.length ? 'none' : '' }}>
      {editable && (
        <SpecificationTableBatchSetting
          expandColumnsFieldPropsMap={expandColumnsFieldPropsMaps}
          onBatchSetting={handleBatchSettingByHooks}
          fromProductInfoId={fromProductInfoId}
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
