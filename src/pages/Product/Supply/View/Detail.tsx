import { useCallback, useMemo } from 'react';
import { Card } from 'antd';
import { useMount, useDebounceEffect, useUnmount } from 'ahooks';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';
import type { RouteChildrenProps } from '@/typings/basis';
import { NormalForm } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { toFixed } from '@/components/Library/MoneyText';

import { useFields } from '@/pages/Product/Manager/Form/components/FormFields';

import {
  formatTabelDataSourceToDescarteData,
  clearSkuTableDataCache,
  clearCheckAttributesCache,
} from '@/pages/Product/Manager/Form/Utils/Specification';
import { generateGridRowSchemas } from '@/pages/Product/Manager/Form/Utils';
import { generateGridLayout } from '@/pages/Product/Manager/Form/components/FormFields/ParamsList/help';

import { setSpecificationTable } from '@/pages/Product/Manager/Form/Fields/SkuLayout';

import './index.less';
import styles from '../Form/index.less';

import { SpecificationTable } from '../Form/components/FormFields/SpecificationTable';
import { modelNamespace } from '../Form';
import { generateColumnToFormField, expandColumnsFieldMap } from '../Form/Utils/TableColumns';

const formActions = createAsyncFormActions();

export default function ProductSupplyViewDetail({
  match,
  route,
}: RouteChildrenProps<{ id: string }>) {
  const { initialValues } = useStoreState(modelNamespace);
  const [state, setState] = useImmer({
    defaultCheckAttributes: {},
    defaultPriceData: {},
  });

  const fieldComponents = useFields({
    // sku table
    specificationTable: SpecificationTable,
  });

  useMount(() => {
    window
      .$fastDispatch((model) => model[modelNamespace].handleInitialValues, {
        id: match.params.id,
        isSnapshot: route.isSnapshot,
      })
      .then((res) => {
        if (res.paramPropKeyNames) {
          formActions.setFieldState('productParams', (fieldState) => {
            fieldState.display = !!res.paramPropKeyNames?.length;
          });
        }
      });
  });

  useUnmount(() => {
    window.$fastDispatch((model) => model[modelNamespace].resetInitialValues);

    clearSkuTableDataCache();
    clearCheckAttributesCache();
  });

  const switchProductPriceAndSkuLayoutDisplay = useCallback(
    ({
      priceDisplay = true,
      skuDisplay = true,
    }: {
      priceDisplay?: boolean;
      skuDisplay?: boolean;
    }) => {
      formActions.setFieldState('productPrice', (fieldState) => {
        fieldState.display = priceDisplay;
      });

      formActions.setFieldState('productSku', (fieldState) => {
        fieldState.display = skuDisplay;
      });
    },
    [formActions],
  );

  useDebounceEffect(
    () => {
      if (!initialValues.products.length || !initialValues.products[0].salePropValIds.length) {
        switchProductPriceAndSkuLayoutDisplay({ skuDisplay: false });

        if (initialValues.products[0]) {
          setState((draft) => {
            // eslint-disable-next-line prefer-destructuring
            draft.defaultPriceData = initialValues.products[0];
          });
        }

        return;
      }

      switchProductPriceAndSkuLayoutDisplay({ priceDisplay: false });

      const specificationKeyValuePairs = {};
      initialValues.salePropKeyIds.forEach((id, index) => {
        specificationKeyValuePairs[id] = initialValues.salePropKeyNames[index];
      });

      const newProducts = initialValues.products.map((v) => ({
        ...v,
        ...['supplyPrice', 'suggestSalePrice', 'lowerSalePrice'].reduce((prev, k) => {
          prev[k] = `￥${toFixed(v[k])}`;

          return prev;
        }, {} as AnyObject),
      }));

      const { dataSource, columns } = formatTabelDataSourceToDescarteData(
        newProducts,
        specificationKeyValuePairs,
        generateColumnToFormField as any,
      );

      formActions
        .setFormState((formState: any) => {
          if (formState.values?.specificationTable) {
            formState.values.specificationTable = dataSource;
          }
        })
        .then(() => {
          setSpecificationTable({
            columns,
            dataSource,
            fieldPath: 'productSku.specificationTable',
            setFieldState: formActions.setFieldState,
          });
        });
    },
    [initialValues],
    { wait: 300 },
  );

  const paramsChildren = useMemo(
    () =>
      generateGridRowSchemas<string>({
        prefix: 'params_',
        rowLimit: 3,
        dataSource: initialValues.paramPropKeyNames,
        generateGridSchema: () => generateGridLayout(3),
        generateChildrenSchema: (name, paramsChildrenSchema, _gridIndex, index) => {
          const fieldPath = `${initialValues.paramPropKeyIds[index]}_${_gridIndex}_${index}`;

          paramsChildrenSchema[fieldPath] = {
            title: name,
            type: 'string',
            default: initialValues.paramVals[index] || '',
          };
        },
      }),
    [initialValues.paramPropKeyNames, initialValues.paramVals],
  );

  return (
    <Card>
      <NormalForm
        initialValues={{
          ...initialValues,
          ...state.defaultPriceData,
          chargeUnits: initialValues.chargeUnit?.chargeUnitName,
          categoryId: initialValues.categoryIds
            .map((_, index) => initialValues[`category${index + 1}Name`])
            .join(' / '),
        }}
        actions={formActions}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        editable={false}
        fields={fieldComponents}
        previewPlaceholder=" "
        schema={{
          productInfo: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '商品信息',
              type: 'inner',
            },
            properties: {
              item1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8, 8],
                },
                properties: {
                  name: {
                    title: '商品名称',
                    type: 'string',
                  },
                  categoryId: {
                    title: '所属分类',
                    type: 'string',
                  },
                  chargeUnits: {
                    title: '计价单位',
                    type: 'string',
                  },
                },
              },

              // ====
              item2: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8],
                },
                properties: {
                  brandName: {
                    title: '商品品牌',
                    type: 'string',
                  },
                  serial: {
                    title: '商品排序',
                    type: 'string',
                  },
                },
              },

              // ====
              item3: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8],
                },
                properties: {
                  virtualUrl: {
                    title: '三维效果',
                    type: 'string',
                  },
                },
              },

              images: {
                title: '商品图片',
                type: 'uploadFile',
                'x-props': {
                  itemClassName: styles.viewFormItem,
                },
                'x-component-props': {
                  className: styles.viewFormItem,
                  limit: initialValues.images?.length,
                  defaultValue: initialValues.images,
                },
              },

              videoUrl: {
                title: '商品视频',
                type: initialValues.videoUrl ? 'uploadVideo' : 'string',
                'x-props': {
                  itemClassName: styles.viewFormItem,
                },
                'x-component-props': {
                  defaultValue: initialValues.videoUrl,
                },
              },
            },
          },

          productPrice: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '商品价格',
              type: 'inner',
              className: styles.viewWrapper,
            },
            properties: {
              item1: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [12, 12],
                },
                properties: {
                  supplyPrice: {
                    title: '供货价',
                    type: 'string',
                  },
                  suggestSalePrice: {
                    title: '建议零售价',
                    type: 'string',
                  },
                },
              },

              item2: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [12, 12],
                },
                properties: {
                  lowerSalePrice: {
                    title: '最低销售价',
                    type: 'string',
                  },
                  minimumSale: {
                    title: '起批数量',
                    type: 'string',
                  },
                },
              },

              item3: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [12, 12],
                },
                properties: {
                  stock: {
                    title: '商品库存',
                    type: 'string',
                  },
                  warning: {
                    title: '库存预警',
                    type: 'string',
                  },
                },
              },
            },
          },

          productParams: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '商品参数',
              type: 'inner',
              className: styles.viewWrapper,
            },
            properties: paramsChildren,
          },

          productSku: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '商品规格',
              type: 'inner',
            },
            properties: {
              specificationTable: {
                type: 'array',
                'x-component': 'specificationTable',
                'x-props': {
                  itemClassName: 'full-width__form-item-control',
                },
                'x-component-props': {
                  columns: [],
                },
                items: {
                  type: 'object',
                  properties: expandColumnsFieldMap(),
                },
              },
            },
          },

          productDetail: {
            type: 'object',
            'x-component': 'card',
            'x-component-props': {
              title: '商品详情',
              type: 'inner',
              className: 'product-detail-container',
            },
            properties: {
              introductions: {
                type: 'detailEditor',
                'x-props': {
                  itemClassName: 'full-width__form-item-control',
                },
              },
            },
          },
        }}
      />
    </Card>
  );
}
