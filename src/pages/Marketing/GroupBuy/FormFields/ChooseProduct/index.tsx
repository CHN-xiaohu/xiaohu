/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import { useCallback } from 'react';

import * as React from 'react';
import type { ISchemaFieldComponentProps } from '@formily/antd';
import { createAsyncFormActions } from '@formily/antd';
import { useMount } from 'ahooks';

import { useModal } from '@/foundations/hooks';
import { GeneralTableLayout, useGeneralTableActions } from '@/components/Business/Table';
import { MoneyText } from '@/components/Library/MoneyText';
import type { ProductColumns } from '@/pages/Product/Api';
import { getCategoriesByValid } from '@/pages/Product/Api';
import { formatCategoryData } from '@/pages/Product/Utils';

import { getGroupBuyProducts } from '../../../Api';

const formActions = createAsyncFormActions();

const useChooseProductModal = (
  chooseProductCallback: (row: ProductColumns) => void,
  timeRange: string[],
) => {
  const { actionsRef } = useGeneralTableActions<ProductColumns>();

  useMount(() => {
    getCategoriesByValid().then((res) => {
      formActions.setFieldState('categoryId', (fieldState) => {
        fieldState.props!['x-component-props']!.treeData = formatCategoryData(res.data as any);
      });
    });
  });

  const handleChooseProduct = useCallback(
    (row: ProductColumns) => (e: React.MouseEvent) => {
      e.stopPropagation();

      closeModal();

      chooseProductCallback(row);
    },
    [chooseProductCallback],
  );

  const { openModal, modalElement, closeModal } = useModal({
    title: '选择参与团购的商品',
    width: '90vw',
    style: {
      top: '3vh',
      height: '94vh',
    },
    bodyStyle: {
      height: '80vh',
      overflow: 'auto',
    },
    okButtonProps: {
      style: {
        display: 'none',
      },
    },
    children: (
      <GeneralTableLayout<ProductColumns>
        request={(params: any) =>
          getGroupBuyProducts({
            ...params,
            startTime: params?.timeRange?.[0] || timeRange?.[0],
            endTime: params?.timeRange?.[1] || timeRange?.[1],
          })
        }
        getActions={actionsRef}
        searchProps={{
          minItem: 3,
          actions: formActions,
          items: [
            {
              name: {
                title: '模糊查询',
                type: 'string',
                col: 8,
                'x-component-props': {
                  placeholder: '商品名称',
                },
              },
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                col: 8,
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: [],
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                  allowClear: true,
                },
              },
            },
          ],
        }}
        operationButtonListProps={false}
        columns={[
          {
            title: '商品图',
            width: 90,
            dataIndex: 'image',
            image: true,
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            ellipsisProps: true,
          },
          {
            title: '类目',
            dataIndex: 'categoryNamePath',
            ellipsisProps: true,
          },
          {
            title: '单位',
            dataIndex: ['chargeUnit', 'chargeUnitName'],
            width: 100,
          },
          {
            title: '采购价',
            dataIndex: 'minSalePrice',
            render: (_, item) => (
              <span>
                <MoneyText>{item.minVipPurchasePrice}</MoneyText> ~{' '}
                <MoneyText>{item.maxPurchasePrice}</MoneyText>
              </span>
            ),
          },
          {
            title: '采购价',
            dataIndex: 'flag',
            render: (value, row) => {
              const flagMap = {
                1: <a onClick={handleChooseProduct(row)}>选取</a>,
                2: '已参与团购',
                3: '不支持非标准计价商品',
              };

              return flagMap[value];
            },
          },
        ]}
      />
    ),
  });

  const openChooseProductModal = useCallback((_timeRange?: string[]) => {
    if (actionsRef.current.dataSource?.length) {
      actionsRef.current.reload({
        searchFormData: {
          timeRange: _timeRange,
        },
      });
    }

    openModal();
  }, []);

  return {
    openChooseProductModal,
    modalElement,
  };
};

export const ChooseProduct = ({
  value,
  form,
  mutators,
  schema,
  editable,
}: ISchemaFieldComponentProps) => {
  const { timeRange } = schema.getExtendsComponentProps();

  const chooseProductCallback = useCallback((row: ProductColumns) => {
    mutators.change(row.name);
    // 直接在这里设置了，不用再在 effect 再监听设置了
    form.setFieldValue('productId', row.id);
    form.setFieldValue('unit', row.chargeUnit.chargeUnitName);
    form.setFieldValue('activityProductImg', row.image);
  }, []);

  const { openChooseProductModal, modalElement } = useChooseProductModal(
    chooseProductCallback,
    timeRange,
  );

  if (!editable) {
    return value || <></>;
  }

  return (
    <>
      {modalElement}

      {value ? (
        <div>
          {value} <a onClick={() => openChooseProductModal(timeRange)}>重选商品</a>
        </div>
      ) : (
        <a onClick={() => openChooseProductModal(timeRange)}>点击选择参与团购活动的商品</a>
      )}
    </>
  );
};
