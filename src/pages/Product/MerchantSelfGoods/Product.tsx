import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  convenientDateRangeSchema,
  // generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import type { EventEmitter } from 'ahooks/lib/useEventEmitter';

import { useStoreState } from '@/foundations/Model/Hooks/Model';
import type { RouteChildrenProps } from '@/typings/basis';
import type { SorterResult } from 'antd/lib/table/interface';

import { history } from 'umi';
import { useCallback } from 'react';

import { Modal, Spin, message } from 'antd';

import { useLoadingWrapper } from '@/foundations/hooks';

import { getSearchFormData, execUpdateProductState, showPriceOrBetween } from '../Manager/Common';

import { AlertOptionRender } from '../Manager/AlertOptionRender';

import type { SelfProductColumns } from '../Api';
import { getSelfProducts, batchUpdateSelfProductState } from '../Api';
import { useEditStockForm, useEditWarningForm } from '../components/ModifyProductsInBulk';

export type ProductManagerProps = {
  // 商品状态 1: 上架  2:下架
  miniProductState: 1 | 2;
  // 事件总线
  upperAndLowerShelves$: EventEmitter<void>;
} & Partial<RouteChildrenProps>;

export function Product({ miniProductState, upperAndLowerShelves$ }: ProductManagerProps) {
  const { categories } = useStoreState('productCategory');
  const { actionsRef } = useGeneralTableActions<SelfProductColumns>();
  const { isLoading, runRequest } = useLoadingWrapper();
  const [modal, ModalContext] = Modal.useModal();

  const goToViewPage = (id: string) => {
    history.push(`/product/merchantSelfGoods/view/${id}`);
  };

  upperAndLowerShelves$.useSubscription(() => {
    actionsRef.current.reload();
  });

  const updateProductStateFC = (innerProductState: 1 | 2) => {
    execUpdateProductState({
      modal,
      selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
      state: miniProductState,
      onOk: () => {
        runRequest(() =>
          batchUpdateSelfProductState({
            ids: actionsRef.current.selectedRowKeys as string[],
            miniProductState: innerProductState,
          }).then(() => {
            upperAndLowerShelves$.emit();

            actionsRef.current.clearTableSelected();
          }),
        );
      },
    });
  };

  const handleChangeStatus = ({
    dataSource: { row },
    value,
  }: SwitchOnChangeParams<SelfProductColumns, { miniProductState: 1 | 2 }>) =>
    batchUpdateSelfProductState({
      ids: [row.id],
      ...value,
    }).then(() => actionsRef.current.reload());

  const handleTableChange = useCallback(
    (_pagination: any, _filters: any, sorter: SorterResult<SelfProductColumns>) => {
      actionsRef.current.reload(getSearchFormData(_pagination, _filters, sorter));
    },
    [],
  );

  const handleEditStockSuccess = useCallback(() => {
    actionsRef.current.clearTableSelected();
    actionsRef.current.reload();
  }, []);

  const { handleOpenEditStockForm, ModalStockElement } = useEditStockForm({
    onAddSuccess: handleEditStockSuccess,
  });

  const { handleOpenEditWarningForm, ModalWarningElement } = useEditWarningForm({
    onAddSuccess: handleEditStockSuccess,
  });

  const handleEditFn = (Fn: Function) => {
    if (actionsRef.current.selectedRowKeys?.length < 1)
      return message.warning('请勾选需要操作的商品！');
    return Fn({ productInfoIds: actionsRef.current.selectedRowKeys, productType: 4 });
  };

  return (
    <Spin spinning={isLoading}>
      {ModalContext}
      {ModalStockElement}
      {ModalWarningElement}
      <GeneralTableLayout<SelfProductColumns>
        request={(params) => getSelfProducts({ ...params, miniProductState })}
        getActions={actionsRef}
        searchProps={{
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
              '[startDate,endDate]': convenientDateRangeSchema({ title: '添加时间' }),
            },
            {
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                col: 8,
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: categories,
                  // treeDefaultExpandAll: true,
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                  allowClear: true,
                },
              },
            },
          ],
        }}
        operationButtonListProps={false}
        selectedRowsAlertProps={{
          alertOptionRender: (props) =>
            AlertOptionRender({
              props,
              handler: updateProductStateFC,
              productState: miniProductState,
              modifyStock: () => handleEditFn(handleOpenEditStockForm),
              modifyWarning: () => handleEditFn(handleOpenEditWarningForm),
            }),
        }}
        columns={[
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
            title: '所属商家',
            dataIndex: ['store', 'storeName'],
            ellipsisProps: true,
          },
          {
            title: '商品价格',
            sorter: true,
            dataIndex: 'minSalePrice',
            defaultSortOrder: 'descend',
            render: (_, item) => showPriceOrBetween(item.minSalePrice, item.maxSalePrice),
          },
          {
            title: '添加时间',
            dataIndex: 'createTime',
            sorter: true,
            defaultSortOrder: 'descend',
            width: 184,
          },
          {
            title: '上架状态',
            dataIndex: 'miniProductState',
            width: 90,
            switchProps: {
              activeValue: 1,
              inactiveValue: 2,
              modalProps: ({ value }) => ({
                children: value === 1 ? '确定下架该商品？' : '确定上架该商品？',
              }),
              onChange: handleChangeStatus,
            },
          },
          {
            title: '操作',
            dataIndex: 'id',
            width: 110,
            buttonListProps: {
              list: ({ row }) => [{ text: '查看', onClick: () => goToViewPage(row.id) }],
            },
          },
        ]}
        tableProps={{
          onChange: handleTableChange as any,
        }}
      />
    </Spin>
  );
}
