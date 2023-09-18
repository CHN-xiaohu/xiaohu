import { useCallback, useMemo } from 'react';
import { Card } from 'antd';
import { useMount, useUnmount } from 'ahooks';
import { useImmer } from 'use-immer';

import { createAsyncFormActions } from '@formily/antd';
import type { RouteChildrenProps } from '@/typings/basis';
import { NormalForm } from '@/components/Business/Formily';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useFields } from '@/pages/Product/Manager/Form/components/FormFields';

import {
  clearSkuTableDataCache,
  clearCheckAttributesCache,
} from '@/pages/Product/Manager/Form/Utils/Specification';
import { generateGridRowSchemas } from '@/pages/Product/Manager/Form/Utils';
import { generateGridLayout } from '@/pages/Product/Manager/Form/components/FormFields/ParamsList/help';

import './index.less';

import { useWatch } from '@/foundations/hooks';

import styles from '../Form/index.less';

import { modelNamespace } from '../Form';
import { SpecificationTable } from '../Form/Fields/SkuLayout/x-components/SpecificationTable';
import { handleInitSkuTableField, syncInitialValues } from '../Form/Fields/SkuLayout';
import { useAppSchema } from '../Form/Fields/SkuLayout/app/schema';
import { useMiniprogramSchema } from '../Form/Fields/SkuLayout/miniprogram/schema';

const formActions = createAsyncFormActions();

export default function ProductDistributionViewDetail({
  match,
  route,
}: RouteChildrenProps<{ id: string }>) {
  const { initialValues } = useStoreState(modelNamespace);
  const [state, setState] = useImmer({
    defaultPriceData: {},
  });

  const app = useAppSchema(formActions);
  const miniprogram = useMiniprogramSchema(formActions);

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

  useWatch(() => {
    // 没有 sku 的处理
    const showSkuLayout = !!initialValues.products[0]?.salePropValIds.length;

    // 如果没有 sku，那么就需要将 sku table 给移除
    formActions.setFieldState('skuLayout.*.specification', (field) => {
      field.visible = showSkuLayout;
    });

    syncInitialValues(formActions, initialValues, 'skuLayout.*.priceCollection.layout.*');

    if (!showSkuLayout) {
      switchProductPriceAndSkuLayoutDisplay({ skuDisplay: false });

      if (initialValues.products[0]) {
        setState((draft) => {
          // eslint-disable-next-line prefer-destructuring
          draft.defaultPriceData = initialValues.products[0];
        });
      }

      return;
    }

    // 有 sku 的处理
    switchProductPriceAndSkuLayoutDisplay({ priceDisplay: false });

    handleInitSkuTableField(
      formActions,
      initialValues,
      'skuLayout.*.specification.specificationTable',
    );
  }, [initialValues.products]);

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
          salesChannel: [initialValues.mini && '小程序商城', initialValues.purchase && '采购 App']
            .filter(Boolean)
            .join('、'),
          groups: initialValues?.groups?.map((items: any) => items.name)?.join('、'),
          productStateText:
            Number(initialValues?.productInfo?.productState) === 1 ? '上架' : '下架',
        }}
        actions={formActions}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        editable={false}
        fields={fieldComponents}
        previewPlaceholder=" "
        className="product--distribution-view"
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
                'x-component': 'mega-layout',
                'x-props': {
                  // 在 mega-layout 不生效
                  wrapperCol: { span: 24 },
                },
                'x-component-props': {
                  grid: true,
                  autoRow: true,
                  columns: 3,
                },
                properties: {
                  storeName: {
                    title: '供货商',
                    type: 'string',
                    visible: !!initialValues.mini,
                  },
                  brandName: {
                    title: '商品品牌',
                    type: 'string',
                  },
                  productStateText: {
                    title: '商品状态',
                    type: 'string',
                  },
                  salesChannel: {
                    title: '销售渠道',
                    type: 'string',
                  },
                  serial: {
                    title: '商品排序',
                    type: 'string',
                  },
                  virtualUrl: {
                    title: '三维效果',
                    type: 'string',
                  },
                },
              },

              item3: {
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

          skuLayout: {
            type: 'object',
            'x-component': 'tab',
            'x-component-props': {
              type: 'card',
              defaultActiveKey: 'app',
              className: styles.detailTabs,
            },
            properties: {
              app: {
                type: 'object',
                'x-component': 'tabpane',
                visible: !!initialValues.purchase,
                'x-component-props': {
                  tab: 'App 商品',
                },
                properties: app.properties,
              },
              miniprogram: {
                type: 'object',
                'x-component': 'tabpane',
                visible: !!initialValues.mini,
                'x-component-props': {
                  tab: '小程序商品',
                },
                properties: miniprogram.properties,
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
