import React, { useCallback } from 'react';
import {
  GeneralTableLayout,
  useGeneralTableActions,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import type { SorterResult } from 'antd/lib/table/interface';
import { Spin, Modal, message } from 'antd';
import { history } from 'umi';
import type { EventEmitter } from 'ahooks/lib/useEventEmitter';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useLoadingWrapper } from '@/foundations/hooks';

import { usePersistFn } from 'ahooks';

import { useEditGroupsForm } from '../Manager/Form/components/FormFields/GroupsFrom';

import type { DistributionProductColumns } from '../Api';
import {
  batchUpdateDistributionProductState,
  getDistributionProducts,
  deleteInvalidDistributionProduct,
} from '../Api';
import { useGroupsToSelectOptions } from '../useGroupsToSelectOptions';
import { getSearchFormData, execUpdateProductState, showPriceOrBetween } from '../Manager/Common';
import { stringFilterOption } from '../Manager/Form/Fields/ProductInfoLayout';

type Props = {
  // 商品状态 1: 上架 , 2:下架
  productState?: 1 | 2;
  // 商品有效状态: 1 有效；0 失效
  status?: 1 | 0;
  upperAndLowerShelves$: EventEmitter<void>;
  brands: {
    value: string;
    label: string;
  }[];
};

export const Distribution = React.memo(
  ({ productState, status = 1, upperAndLowerShelves$, brands }: Props) => {
    const { categories } = useStoreState('productCategory');
    const { groupsSelectOptions } = useGroupsToSelectOptions();
    const { actionsRef } = useGeneralTableActions<DistributionProductColumns>();
    const { isLoading, runRequest } = useLoadingWrapper();
    const [modal, ModalContext] = Modal.useModal();

    const goToFormPage = (item?: any) => {
      history.push(`/product/distribution/form${(item?.id && `/${item.id}`) || ''}`);
    };

    const goToViewPage = (id: string) => {
      history.push(`/product/distribution/view/${id}`);
    };

    upperAndLowerShelves$.useSubscription(() => {
      actionsRef.current.reload();
    });

    // 批量上下架
    const handleUpdateProductState = (innerProductState: 1 | 2, content?: React.ReactNode) => {
      execUpdateProductState({
        modal,
        selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
        state: productState,
        content,
        onOk: () => {
          runRequest(() =>
            batchUpdateDistributionProductState({
              ids: actionsRef.current.selectedRowKeys as string[],
              productState: innerProductState,
            }).then(() => {
              upperAndLowerShelves$.emit();

              actionsRef.current.clearTableSelected();
            }),
          );
        },
      });
    };

    const handleDeleteProducts = usePersistFn((ids: string[]) => {
      runRequest(() =>
        deleteInvalidDistributionProduct({ ids: ids.join(',') }).then(() => {
          upperAndLowerShelves$.emit();

          actionsRef.current.clearTableSelected();
        }),
      );
    });

    const handleDeleteInvalidProduct = usePersistFn(() => {
      execUpdateProductState({
        modal,
        selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
        content: '确定要删除所选的无效商品？',
        onOk: () => {
          handleDeleteProducts(actionsRef.current.selectedRowKeys as string[]);
        },
      });
    });

    const handleTableChange = React.useCallback(
      (_pagination: any, _filters: any, sorter: SorterResult<any>) => {
        actionsRef.current.reload(getSearchFormData(_pagination, _filters, sorter));
      },
      [],
    );

    const handleCreateEditSuccess = useCallback(() => actionsRef.current.clearTableSelected(), []);

    const { openForm, ModalFormElement } = useEditGroupsForm({
      onAddSuccess: handleCreateEditSuccess,
      productList: actionsRef.current.selectedRowKeys,
      productType: 3,
    });

    const handleEditGroups = () => {
      if (actionsRef.current.selectedRowKeys?.length < 1)
        return message.warning('请勾选需要操作的商品！');
      return openForm();
    };

    return (
      <Spin spinning={isLoading}>
        {ModalContext}
        {ModalFormElement}

        <GeneralTableLayout<DistributionProductColumns, any>
          {...{
            request: (params) => {
              if (params.salesChannel) {
                params[params.salesChannel] = 1;
              }

              return getDistributionProducts({ ...params, productState, status });
            },
            getActions: actionsRef,
            searchProps: {
              minItem: 3,
              items: [
                {
                  name: {
                    title: '模糊查询',
                    type: 'string',
                    'x-component-props': {
                      placeholder: '商品名称',
                    },
                  },
                  categoryId: {
                    title: '商品类目',
                    type: 'treeSelect',
                    'x-component-props': {
                      placeholder: '请选择商品类目',
                      treeData: categories,
                      showSearch: true,
                      treeNodeFilterProp: 'title',
                      allowClear: true,
                    },
                  },
                  salesChannel: {
                    title: '销售渠道',
                    type: 'checkableTags',
                    'x-component-props': {
                      options: generateDefaultSelectOptions([
                        { label: '采购 App', value: 'purchase' },
                        { label: '小程序商城', value: 'mini' },
                      ]),
                    },
                  },
                },
                {
                  brandId: {
                    title: '商品品牌',
                    type: 'string',
                    'x-component-props': {
                      dataSource: brands || [],
                      showSearch: true,
                      filterOption: stringFilterOption,
                      placeholder: '请选择商品品牌',
                    },
                  },
                  groupId: {
                    title: '商品分组',
                    type: 'string',
                    'x-component-props': {
                      dataSource: groupsSelectOptions || [],
                      showSearch: true,
                      filterOption: stringFilterOption,
                      placeholder: '请选择商品品牌',
                    },
                  },
                },
              ],
            },
            operationButtonListProps: {
              list: [
                {
                  text: '修改分组',
                  onClick: () => handleEditGroups(),
                },
                {
                  text: '集采选品',
                  onClick: () => history.push('/collection/collectCenter'),
                  type: 'primary',
                },
              ],
            },
            selectedRowsAlertProps: {
              alertOptionRender: (props) => {
                const { intl, onCleanSelected } = props;

                let shelvesOrTakeOffDom: JSX.Element | undefined =
                  productState !== 1 ? (
                    <a
                      key="0"
                      onClick={() =>
                        handleUpdateProductState(
                          1,
                          <>
                            <p>确定要上架选中的商品？</p>
                            <p>请谨慎检查商品价格，上架后若因商品价格造成的亏损，店铺需自行承担</p>
                          </>,
                        )
                      }
                    >
                      {intl.formatMessage({ id: 'product.table.alert.shelves' })}
                    </a>
                  ) : (
                    <a key="1" onClick={() => handleUpdateProductState(2)}>
                      {intl.formatMessage({ id: 'product.table.alert.takeOff' })}
                    </a>
                  );

                const deleteDom = !status && (
                  <a onClick={handleDeleteInvalidProduct} key="5">
                    {intl.formatMessage({ id: 'distributionProduct.table.alert.delete' })}
                  </a>
                );

                if (!status) {
                  shelvesOrTakeOffDom = undefined;
                }

                return [
                  shelvesOrTakeOffDom,
                  deleteDom,
                  <a onClick={onCleanSelected} key="2">
                    {intl.formatMessage({ id: 'table.alert.clear' })}
                  </a>,
                ].filter(Boolean);
              },
            },
            columns: [
              {
                title: '序号',
                dataIndex: 'serial',
                width: 100,
              },
              {
                title: '首图',
                width: 72,
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
                title: '供货价',
                dataIndex: 'minSalePrice',
                render: (_, item) => showPriceOrBetween(item.minSupplyPrice, item.maxSupplyPrice),
              },
              {
                title: '零售价',
                dataIndex: 'minSalePrice',
                render: (_, item) => {
                  const prices = [
                    (item.minSuggestSalePrice || item.maxSuggestSalePrice) && (
                      <>
                        采购：
                        {showPriceOrBetween(item.minSuggestSalePrice, item.maxSuggestSalePrice)}
                      </>
                    ),

                    (item.minVipPurchasePrice || item.maxPurchasePrice) && (
                      <>
                        零售：{showPriceOrBetween(item.minVipPurchasePrice, item.maxPurchasePrice)}
                      </>
                    ),
                  ].filter(Boolean) as any[];

                  return prices.map((c, key) =>
                    React.createElement(
                      prices.length === 2 ? 'p' : 'span',
                      // eslint-disable-next-line react/no-array-index-key
                      { key },
                      c,
                    ),
                  );
                },
              },
              {
                title: '销售渠道',
                dataIndex: 'minSalePrice',
                formatterValue: ({ row }) =>
                  [row.mini && '小程序商城', row.purchase && '采购 App'].filter(Boolean).join('、'),
              },
              {
                title: '操作',
                dataIndex: 'id',
                width: 110,
                buttonListProps: {
                  list: ({ row }) => [
                    {
                      text: '查看',
                      onClick: () => goToViewPage(row.id),
                      visible: !!status,
                    },
                    {
                      text: '编辑',
                      onClick: () => goToFormPage(row),
                      visible: !!status,
                    },
                    {
                      text: '删除',
                      danger: true,
                      visible: !status,
                      popconfirmProps: {
                        onConfirm: () => {
                          handleDeleteProducts([row.id]);
                        },
                      },
                    },
                  ],
                },
              },
            ],
            tableProps: {
              onChange: handleTableChange as any,
            },
          }}
        />
      </Spin>
    );
  },
);
