import type { TCreateLinkageUtils } from '@/components/Business/Formily';
import { createLinkageUtils, resetFieldValueByFormGraph } from '@/components/Business/Formily';

// import { FormPath } from '@formily/antd';

import type { IFormActions, IFormAsyncActions } from '@formily/antd';
import { FormPath, createEffectHook } from '@formily/antd';

import type { generateColumnToFormField } from '@/pages/Product/Manager/Form/Utils/Specification/TableColumns';

import {
  clearSkuTableDataCache,
  clearCheckAttributesCache,
  generateDescarteDataToTabelDataSourceByCheckSpecificationAttribute,
} from '../../Utils/Specification';

import { onSelectedSpecificationAttribute$ } from '../../components/FormFields/SpecificationAttributes';
import { onSpecificationTableBatchSetting$ } from '../../components/FormFields/SpecificationTable';
import { specificationTableFormPath } from '.';

// 自定义事件
export const ON_SKU_TABLE_DATA_SOURCE_CHANGE = 'ON_SKU_TABLE_DATA_SOURCE_CHANGE';
export const onSKUTableDataSourceChange$ = createEffectHook(ON_SKU_TABLE_DATA_SOURCE_CHANGE);

export const clearSkuTableAllCache = () => {
  clearSkuTableDataCache();
  clearCheckAttributesCache();
};

export const dispatchSKUTableDataSourceChange = (
  dispatch: IFormAsyncActions['dispatch'] | IFormActions['dispatch'],
  data = [] as any[],
) => {
  dispatch!(ON_SKU_TABLE_DATA_SOURCE_CHANGE, data);
};

export const setSpecificationTable = ({
  setFieldState,
  columns,
  dataSource,
  isInit = false,
  fieldPath = specificationTableFormPath,
}: {
  setFieldState: IFormActions['setFieldState'];
  isInit?: boolean;
  columns: any[];
  dataSource: any[];
  fieldPath?: string;
}) => {
  setFieldState(fieldPath, (fieldState) => {
    FormPath.setIn(fieldState, 'value', dataSource);
    FormPath.setIn(fieldState, 'props.x-component-props.columns', columns);
    // FormPath.setIn(fieldState, 'props.x-component-props.dataSource', dataSource);

    if (isInit) {
      FormPath.setIn(fieldState, 'props.x-component-props.initialValue', dataSource);
    }
  });
};

export const clearSpecificationTable = (formActions: IFormAsyncActions) => {
  formActions.setFormState((formState: any) => {
    if (formState.values.skuFullLayout) {
      formState.values.skuFullLayout.specificationTable = [];
    }
  });

  resetFieldValueByFormGraph({
    formActions,
    matchPath: specificationTableFormPath,
  });

  setSpecificationTable({
    columns: [],
    dataSource: [],
    setFieldState: formActions.setFieldState,
  });

  dispatchSKUTableDataSourceChange(formActions.dispatch);
};

export const handleSelectedSpecificationAttribute = (
  linkage: TCreateLinkageUtils,
  { selectedRows, selectedRowKeys }: { selectedRows: any; selectedRowKeys: any[] },
  generateColumnToFormFieldFC?: typeof generateColumnToFormField,
) => {
  const {
    columns,
    dataSource,
  } = generateDescarteDataToTabelDataSourceByCheckSpecificationAttribute(
    selectedRows,
    selectedRowKeys,
    generateColumnToFormFieldFC,
  );

  if (!dataSource?.length) {
    clearSpecificationTable(linkage.actions as any);
  }

  requestAnimationFrame(() => {
    setSpecificationTable({
      columns,
      dataSource,
      setFieldState: linkage.setFieldState,
    });

    setTimeout(() => {
      linkage.hostUpdate(() => {
        // 清除不必要的校验异常提示
        linkage.setFieldState(`${specificationTableFormPath}.*.*`, (fieldState) => {
          fieldState.ruleErrors = [];
          fieldState.errors = [];
          fieldState.warnings = [];
          fieldState.effectErrors = [];
        });
      });

      window.$fastDispatch((model) => model.product.switchShowEditCategoryPopconfirm, {
        type: !!dataSource.length,
      });

      dispatchSKUTableDataSourceChange(linkage.dispatch, dataSource);
    });
  });
};

export const handleSpecificationTableBatchSetting = (
  linkage: TCreateLinkageUtils,
  {
    selectedRowIndexs,
    columnInputValues,
  }: { selectedRowIndexs: number[]; columnInputValues: AnyObject },
) => {
  // 这里不用使用 hostUpdate，可能会导致某些字段没有更新到，应该是 formily 的 bug
  for (let i = 0; i < selectedRowIndexs.length; i += 1) {
    Object.keys(columnInputValues).forEach((key) => {
      linkage.setFieldState(
        `${specificationTableFormPath}.${selectedRowIndexs[i]}.${key}`,
        (field) => {
          field.value = columnInputValues[key];
        },
      );
    });
  }
};

export const useSkuLayoutEffects = () => {
  const linkage = createLinkageUtils();

  // 勾选生成新的 sku
  onSelectedSpecificationAttribute$().subscribe((values) => {
    handleSelectedSpecificationAttribute(linkage, values);
  });

  // 批量设置值
  onSpecificationTableBatchSetting$().subscribe((values) => {
    handleSpecificationTableBatchSetting(linkage, values);
  });
};
