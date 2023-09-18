import { useCallback, useMemo } from 'react';
import { Card } from 'antd';
import { useMount, useDebounceEffect, useUnmount } from 'ahooks';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';
import type { RouteChildrenProps } from '@/typings/basis';
import { NormalForm } from '@/components/Business/Formily';

import type { ProductModelState } from '@/pages/Product/models/Product';
import { formatInitialValues, getInitialValues } from '@/pages/Product/models/Product';

import { toFixed } from '@/components/Library/MoneyText';

import {
  generatePriceLayoutPropertiesSchema,
  miniprogramProductPricePropertiesFieldMaps,
} from '../../Manager/Form/Fields/PriceLayout';

import styles from '../../Manager/Form/index.less';

import { useFields } from '../../Manager/Form/components/FormFields';
import {
  generateGridRowSchemas,
  miniprogramSpecificationTableFieldValueToProductSpecificationTableFieldValue,
} from '../../Manager/Form/Utils';
import { generateGridLayout } from '../../Manager/Form/components/FormFields/ParamsList/help';
import {
  formatTabelDataSourceToDescarteData,
  clearSkuTableDataCache,
  clearCheckAttributesCache,
  expandColumnsFieldMap,
} from '../../Manager/Form/Utils/Specification';

import { setSpecificationTable } from '../../Manager/Form/Fields/SkuLayout';
import { getSelfProductDetails } from '../../Api';

// import './index.less';

const formActions = createAsyncFormActions();

export default function ProductMerchantSelfGoodsView({
  match,
}: RouteChildrenProps<{ id: string }>) {
  const [state, setState] = useImmer({
    defaultCheckAttributes: {},
    defaultPriceData: {},
    initialValues: getInitialValues() as ProductModelState['initialValues'],
  });

  const fieldComponents = useFields();

  useMount(() => {
    getSelfProductDetails(match.params.id).then((res) => {
      const initialValues = formatInitialValues<typeof state['initialValues']>(res.data);

      if (initialValues.paramPropKeyNames) {
        formActions.setFieldState('productParams', (fieldState) => {
          fieldState.display = !!initialValues.paramPropKeyNames?.length;
        });
      }

      initialValues.products = initialValues.products.map((item) => ({
        ...item,
        ...miniprogramSpecificationTableFieldValueToProductSpecificationTableFieldValue(item),
      }));

      setState((draft) => {
        draft.initialValues = initialValues;
      });
    });
  });

  useUnmount(() => {
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
      if (
        !state.initialValues.products.length ||
        !state.initialValues.products[0].salePropValIds.length
      ) {
        switchProductPriceAndSkuLayoutDisplay({ skuDisplay: false });

        if (state.initialValues.products[0]) {
          setState((draft) => {
            // eslint-disable-next-line prefer-destructuring
            draft.defaultPriceData = state.initialValues.products[0];
          });
        }

        return;
      }

      switchProductPriceAndSkuLayoutDisplay({ priceDisplay: false });

      setState((draft) => {
        const specificationKeyValuePairs = {};
        draft.initialValues.salePropKeyIds.forEach((id, index) => {
          specificationKeyValuePairs[id] = draft.initialValues.salePropKeyNames[index];
        });

        const newProducts = draft.initialValues.products.map((v) => {
          miniprogramProductPricePropertiesFieldMaps.forEach((item) => {
            const k = item[1];
            if (v[k] && k !== 'stock') {
              v[k] = `￥${toFixed(v[k])}`;
            }
          });

          return v;
        });

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
      });
    },
    [state.initialValues],
    { wait: 300 },
  );

  const paramsChildren = useMemo(
    () =>
      generateGridRowSchemas<string>({
        prefix: 'params_',
        rowLimit: 3,
        dataSource: state.initialValues.paramPropKeyNames || [],
        generateGridSchema: () => generateGridLayout(3),
        generateChildrenSchema: (name, paramsChildrenSchema, _gridIndex, index) => {
          const fieldPath = `${state.initialValues.paramPropKeyIds[index]}_${_gridIndex}_${index}`;

          paramsChildrenSchema[fieldPath] = {
            title: name,
            type: 'string',
            default: state.initialValues.paramVals[index] || '',
          };
        },
      }),
    [state.initialValues.paramPropKeyNames, state.initialValues.paramVals],
  );

  return (
    <Card>
      <NormalForm
        initialValues={{
          ...state.initialValues,
          ...state.defaultPriceData,
          chargeUnits: state.initialValues.chargeUnit?.chargeUnitName,
          categoryId: state.initialValues.categoryIds
            .map((_, index) => state.initialValues[`category${index + 1}Name`])
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
                  storeName: {
                    title: '所属商家',
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

              images: {
                title: '商品图片',
                type: 'uploadFile',
                'x-props': {
                  itemClassName: styles.viewFormItem,
                },
                'x-component-props': {
                  className: styles.viewFormItem,
                  limit: state.initialValues.images?.length,
                  defaultValue: state.initialValues.images,
                },
              },

              videoUrl: {
                title: '商品视频',
                type: state.initialValues.videoUrl ? 'uploadVideo' : 'string',
                'x-props': {
                  itemClassName: styles.viewFormItem,
                },
                'x-component-props': {
                  defaultValue: state.initialValues.videoUrl,
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
              priceGrid: {
                type: 'object',
                'x-component': 'mega-layout',
                'x-component-props': {
                  grid: true,
                  full: true,
                  autoRow: true,
                  columns: 3,
                },
                properties: generatePriceLayoutPropertiesSchema({ isMiniprogramProduct: true }),
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
                  properties: expandColumnsFieldMap(false, true, false),
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
