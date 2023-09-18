import React from 'react';
import { message, Modal } from 'antd';
import { useImmer } from 'use-immer';
import { useLoadingWrapper } from '@/foundations/hooks';
import { MathCalcic } from '@spark-build/web-utils';

import { generateSkuMessageField, getSkuPropsFromProductData, isArea } from './Sku/utils';
import { SkuWrapper } from './SkuWrapper';
import { useSkuFormInstanceRef } from './Sku';

import styles from '../../index.less';
import { getProduct } from '../Api';

export const SkuModal = React.memo(
  ({
    skuPanelEvent,
    skuPanelSkuChangeEvent,
    dataSource,
    onProductChange,
  }: {
    skuPanelEvent: any;
    skuPanelSkuChangeEvent: any;
    onProductChange: ({ data }: { data: any[] }) => void;
    dataSource: any[];
  }) => {
    const [state, setState] = useImmer({
      visible: false,
      skuId: '',
      isUpdate: false,
      currentId: '',
      productDetailData: undefined,
      skuOptions: {
        salePrice: 0,
        maxPrice: 0,
        skuDataSource: undefined,
        initialSku: undefined,
        nonStandardPriceOptions: null,
        standardPriceOptions: null,
      },
      // 打开过 sku 面板的商品数据集合，用于缓存，下次打开会快很多
      dataSourceCaches: {},
    });

    const { getFormInstanceRef } = useSkuFormInstanceRef();
    const { isLoading, runRequest } = useLoadingWrapper();

    const toggle = () => {
      setState((draft) => {
        draft.visible = !draft.visible;
      });
    };

    const getSkuOptionsByProductDataAndSkuId = (
      skuId: string,
      data: any,
      buyNum: React.Key = 0,
    ) => {
      const skuPanelPropsFromProductData = getSkuPropsFromProductData(data);

      const findSkuItem = data.products.find((item) => item.id === skuId);
      skuPanelPropsFromProductData.initialSku = findSkuItem
        ? {
            sku_parent_value_map: skuPanelPropsFromProductData!.skuDataSource!.tree.map(
              (item) => item.k_id,
            ),
            sku_value_map: findSkuItem.salePropValIds,
            selectedNum: Number(buyNum),
            messages: undefined,
          }
        : undefined;

      return skuPanelPropsFromProductData;
    };

    skuPanelEvent.useSubscription(async ({ data, isUpdate }: { data: any; isUpdate: boolean }) => {
      const productId = data?.productInfo?.id;
      const skuId = data?.product?.id;
      if (isUpdate) {
        setState((draft) => {
          draft.isUpdate = true;
          draft.currentId = data.id;
        });
      }

      const commonState = (draft: typeof state) => {
        draft.visible = true;
        draft.skuId = skuId;
      };

      // 如果存在缓存
      const productDetailData = state.dataSourceCaches[productId];
      if (productDetailData) {
        setState((draft) => {
          commonState(draft);

          const skuOptions = getSkuOptionsByProductDataAndSkuId(
            skuId,
            productDetailData,
            data.buyNum,
          );

          Object.assign(draft, {
            productDetailData,
            skuOptions: {
              ...skuOptions,
              nonStandardPriceOptions: {
                ...skuOptions.nonStandardPriceOptions,
                chargeUnit: data.productInfo.chargeUnit,
              },
              standardPriceOptions: data.productInfo.chargeUnit,
            },
          });
        });

        return;
      }

      const productData = await getProduct(productId).then((res) => ({
        ...res.data,
        products: res.data.products.map((item) => ({
          ...item,
          // 方案购物车，无需进行起售限定
          minimumSale: item.minimumSale,
        })),
      }));

      const insetData = {
        productDetailData: productData,
        skuOptions: getSkuOptionsByProductDataAndSkuId(
          skuId,
          {
            ...productData,
            productInfo: {
              ...productData.productInfo,
              chargeUnit: data.productInfo.chargeUnit,
            },
          },
          data.buyNum,
        ),
      };

      setState((draft) => {
        commonState(draft);

        Object.assign(draft, insetData);

        // draft.dataSourceCaches[productId] = insetData.productDetailData;
      });
    });

    const closeAndPrompt = (isUpdate: boolean) => {
      setState((draft) => {
        draft.visible = false;
      });
      !isUpdate && message.success('添加成功！');
    };

    const inventoryTips = (text: string) => {
      message.warn(text);
    };

    const handleShopCartProductSkuChange = React.useCallback(() => {
      return runRequest(() =>
        getFormInstanceRef.current
          ?.handleAddCartOrBuy('addCart')()
          .then(({ skuData = {}, count, ...last }: AnyObject) => {
            const { standardPriceOptions, nonStandardPriceOptions } = state.skuOptions;
            const calcStockNum = new MathCalcic(count);

            if (nonStandardPriceOptions) {
              const { attrResult } = nonStandardPriceOptions!.chargeUnit as any;
              calcStockNum.multipliedBy(last[generateSkuMessageField(0)]);
              if (isArea(attrResult)) {
                calcStockNum.multipliedBy(last[generateSkuMessageField(1)]);
              }
            }

            if (state.productDetailData?.productInfo?.productState !== 1) {
              return inventoryTips('商品已下架！');
            }

            if (skuData.minimumSale > skuData.stock_num) {
              return inventoryTips('库存不足！');
            }

            if (skuData.stock_num < calcStockNum.toNumber()) {
              return inventoryTips('库存不足！');
            }

            const data = {
              buyNum: count,
              supplyPrice: Number(skuData.supplyPrice),
              product: {
                ...skuData,
                image:
                  skuData.image !== ''
                    ? skuData.image
                    : state.productDetailData!.productInfo!.image,
                sku: skuData.salePropValNames?.join(','),
                skuGroup: state
                  .productDetailData!.salePropKeyNames.map(
                    (pn, index) => `${pn}:${skuData.salePropValNames[index]}`,
                  )
                  .join(';'),
              },
              productInfo: {
                store: {} as any,
                ...state.productDetailData!.productInfo,
                chargeUnit: {
                  ...state.productDetailData!.productInfo.chargeUnit,
                  ...standardPriceOptions,
                },
              },
            };

            if (nonStandardPriceOptions && Object.keys(last).length) {
              data.productInfo.chargeUnit = {
                ...data.productInfo.chargeUnit,
                chargeUnitId: nonStandardPriceOptions.chargeUnit.chargeUnitId,
                attrs: nonStandardPriceOptions.chargeUnit.attrs.map((item, index) => ({
                  ...item,
                  attrVal: last[generateSkuMessageField(index)] as string,
                })),
              };
            }

            if (state.isUpdate) {
              const currentIndex = dataSource?.findIndex((obj) => obj.id === state.currentId);
              if (
                dataSource.some((item) => item.id === data.product.id) &&
                state.currentId !== data.product.id
              ) {
                dataSource.splice(currentIndex, 1);
                const dataIndex = dataSource?.findIndex((obj) => obj.id === data.product.id);
                if (data.product.stock_num < dataSource[dataIndex].buyNum + data.buyNum) {
                  return inventoryTips('库存不足！');
                }
                const newItem = {
                  ...data,
                  buyNum: dataSource[dataIndex].buyNum + data.buyNum,
                  id: data.product.id,
                };
                dataSource.splice(dataIndex, 1, newItem);
                onProductChange({ data: dataSource });
                return closeAndPrompt(state.isUpdate);
              }
              const newItem = {
                ...data,
                id: data.product.id,
              };
              dataSource.splice(currentIndex, 1, newItem);
              onProductChange({ data: dataSource });
              return closeAndPrompt(state.isUpdate);
            }

            if (dataSource && !!dataSource.length) {
              const isExisted = dataSource.find((item: any) => item.id === data.product.id);
              if (!isExisted) {
                onProductChange({ data: [...dataSource, { ...data, id: data.product.id }] });
                return closeAndPrompt(state.isUpdate);
              }
              const dataIndex = dataSource?.findIndex((obj) => obj.id === data.product.id);
              if (isExisted.product.stock_num < isExisted.buyNum + data.buyNum) {
                return inventoryTips('库存不足！');
              }
              const newItem = {
                ...isExisted,
                buyNum: isExisted.buyNum + data.buyNum,
              };
              dataSource.splice(dataIndex, 1, newItem);
              onProductChange({ data: dataSource });
              return closeAndPrompt(state.isUpdate);
            }
            onProductChange({ data: [{ ...data, id: data.product.id }] });
            return closeAndPrompt(state.isUpdate);
          }),
      );
    }, [getFormInstanceRef, skuPanelSkuChangeEvent, setState, state, runRequest]);

    return (
      <Modal
        title="请选择规格"
        width={750}
        className={styles.skuModal}
        visible={state.visible}
        onCancel={toggle}
        okButtonProps={{
          loading: isLoading,
          children: '确定',
        }}
        onOk={handleShopCartProductSkuChange}
        destroyOnClose
      >
        <SkuWrapper
          {...{
            dataSource: state.skuOptions,
            getFormInstance: getFormInstanceRef,
            showBuyBtn: false,
            showAddCartBtn: false,
            showNonStandardPriceMessage: true,
          }}
        />
      </Modal>
    );
  },
);
