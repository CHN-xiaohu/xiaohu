import { useCallback, useMemo } from 'react';
import { Card } from 'antd';
import { useMount, useDebounceEffect, useUnmount } from 'ahooks';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';
import type { RouteChildrenProps } from '@/typings/basis';
import { NormalForm } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { toFixed } from '@/components/Library/MoneyText';

import styles from '../Form/index.less';

import { useFields } from '../Form/components/FormFields';
import { generateGridRowSchemas } from '../Form/Utils';
import { generateGridLayout } from '../Form/components/FormFields/ParamsList/help';
import {
  formatTabelDataSourceToDescarteData,
  clearSkuTableDataCache,
  clearCheckAttributesCache,
  expandColumnsFieldMap,
} from '../Form/Utils/Specification';

import { setSpecificationTable } from '../Form/Fields/SkuLayout';

import './index.less';

const formActions = createAsyncFormActions();

export default function ProductManagerView({ match }: RouteChildrenProps<{ id: string }>) {
  const { initialValues } = useStoreState('product');
  const [state, setState] = useImmer({
    defaultCheckAttributes: {},
    defaultPriceData: {},
  });

  const fieldComponents = useFields();

  useMount(() => {
    window
      .$fastDispatch((model) => model.product.handleInitialValues, { id: match.params.id })
      .then((res) => {
        if (res.paramPropKeyNames) {
          formActions.setFieldState('productParams', (fieldState) => {
            fieldState.display = !!res.paramPropKeyNames?.length;
          });
        }
      });
  });

  useUnmount(() => {
    window.$fastDispatch((model) => model.product.resetInitialValues);

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
        ...['factoryPrice', 'vipPurchasePrice', 'purchasePrice'].reduce((prev, k) => {
          prev[k] = `￥${toFixed(v[k])}`;

          return prev;
        }, {} as AnyObject),
      }));

      const { dataSource, columns } = formatTabelDataSourceToDescarteData(
        newProducts,
        specificationKeyValuePairs,
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
          groups: initialValues?.groups?.map((items: any) => items.name)?.join('、'),
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
                  supplierName: {
                    title: '商品供应商',
                    type: 'string',
                  },
                  brandName: {
                    title: '商品品牌',
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
                  serial: {
                    title: '商品排序',
                    type: 'string',
                  },
                },
              },

              item4: {
                type: 'object',
                'x-component': 'grid',
                'x-component-props': {
                  gutter: 24,
                  cols: [8, 8],
                },
                properties: {
                  groups: {
                    title: '商品分组',
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
                  factoryPrice: {
                    title: '成本价',
                    type: 'string',
                  },
                  vipPurchasePrice: {
                    title: '会员采购价',
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
                  purchasePrice: {
                    title: '普通采购价',
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
                  properties: expandColumnsFieldMap(false, false, false),
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
