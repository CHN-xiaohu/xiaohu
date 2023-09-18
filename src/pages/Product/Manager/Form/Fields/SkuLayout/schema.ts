import { useMemo } from 'react';
import type { ISchemaFormAsyncActions } from '@formily/antd';

import type { TSchemas } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { useWatch } from '@/foundations/hooks';

import { useHandleAttributeFormField } from './useHandleAttributeFormField';

import { useResetSkuValues } from './useResetSkuValues';

import { useFormatTableDataSourceToDescarteData } from './useFormatTableDataSourceToDescarteData';

import { useLayoutFieldVisibleSwitch } from './useLayoutFieldVisibleSwitch';

import { expandColumnsFieldMap } from '../../Utils/Specification';

export type ISpecificationOption = {
  label: string;
  value: string;
  parent_id: string;
  parent_name: string;
};

export const specificationFormPath = 'formLayout.skuFullLayout.skuLayout';
export const specificationTableFormPath = `${specificationFormPath}.specificationTable`;
export const specificationAttributesFormPath = `${specificationFormPath}.specificationAttributes`;

export const useSkuLayoutBySchema = (
  formActions: ISchemaFormAsyncActions,
  isImportFromProduct: boolean,
  isMiniprogramProduct: boolean,
): TSchemas => {
  const { attributes, initialValues } = useStoreState('product');

  // 根据接口返回的数据来还原被选中的规格属性值
  const { setDefaultCheckAttributes, realAttributes } = useHandleAttributeFormField({
    formActions,
  });

  // 重置 sku table 相关处理
  const formatTableDataSourceToDescarteDataOnce = useResetSkuValues({
    formActions,
    setDefaultCheckAttributes,
  });

  // 将后端返回的 sku 数据转化为笛卡尔积的相关处理
  useFormatTableDataSourceToDescarteData({
    formActions,
    onceRef: formatTableDataSourceToDescarteDataOnce,
    setDefaultCheckAttributes,
  });

  useLayoutFieldVisibleSwitch({
    formActions,
    attributes,
    realAttributes,
    initialValues,
    isImportFromProduct,
  });

  // 判断小程序商品是否可查看商品拿货价
  const fromProductInfoId =
    isMiniprogramProduct && Number(initialValues?.fromType) === 1
      ? initialValues.fromProductInfoId
      : '';

  useWatch(() => {
    formActions.setFieldState(specificationTableFormPath, (fieldState) => {
      fieldState.props!['x-component-props']!.isMiniprogramProduct = isMiniprogramProduct;
    });
    formActions.setFieldState(specificationTableFormPath, (fieldState) => {
      fieldState.props!['x-component-props']!.fromProductInfoId = fromProductInfoId;
    });
  }, [isMiniprogramProduct, fromProductInfoId]);

  return useMemo(() => {
    return {
      type: 'object',
      'x-component': 'card',
      'x-component-props': {
        title: '商品属性',
        type: 'inner',
      },
      properties: {
        specificationAttributes: {
          type: 'array',
          'x-component': 'specificationGroups',
          display: !isImportFromProduct,
          'x-component-props': {
            dataSource: [],
          },
        },

        specificationTable: {
          type: 'array',
          'x-component': 'specificationTable',
          editable: true,
          'x-component-props': {
            isMiniprogramProduct,
            fromProductInfoId,
            initialValue: [],
            expandColumnsObj: {
              takeThePrice: '成本价',
            },
          },
          items: {
            type: 'object',
            properties: {
              ...(!isImportFromProduct
                ? {}
                : {
                    takeThePrice: {
                      type: 'string',
                      'x-props': {
                        itemStyle: {
                          color: '#1890FF',
                        },
                      },
                    },
                  }),
              ...expandColumnsFieldMap(isImportFromProduct, isMiniprogramProduct),
            },
          },
        },
      },
    } as TSchemas;
  }, [isImportFromProduct]);
};
