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

import { getSearchFormData, execUpdateProductState, showPriceOrBetween } from './Common';

import { AlertOptionRender } from './AlertOptionRender';

import { stringFilterOption } from '../Manager/Form/Fields/ProductInfoLayout';
import { useEditGroupsForm } from '../Manager/Form/components/FormFields/GroupsFrom';

import type { ProductColumns } from '../Api';
import { getProducts, updateProductState, batchUpdateProductState } from '../Api';

import { useGroupsToSelectOptions } from '../useGroupsToSelectOptions';
import { useBrandsToSelectOptions } from '../useBrandsToSelectOptions';
import { useEditStockForm, useEditWarningForm } from '../components/ModifyProductsInBulk';

export type ProductManagerProps = {
  // 商品状态 1: 上架  2:下架
  productState: 1 | 2;
  // 事件总线
  upperAndLowerShelves$: EventEmitter<void>;
} & Partial<RouteChildrenProps>;

export function Product({ productState, upperAndLowerShelves$ }: ProductManagerProps) {
  const { categories } = useStoreState('productCategory');
  const { actionsRef } = useGeneralTableActions<ProductColumns>();
  const { isLoading, runRequest } = useLoadingWrapper();
  const [modal, ModalContext] = Modal.useModal();
  const { groupsSelectOptions } = useGroupsToSelectOptions();
  const { brandsSelectOptions } = useBrandsToSelectOptions();

  const goToFormPage = (item?: ProductColumns) => {
    history.push(`/product/manager/form${(item?.id && `/${item.id}`) || ''}`);
  };

  const goToViewPage = (id: string) => {
    history.push(`/product/manager/view/${id}`);
  };

  upperAndLowerShelves$.useSubscription(() => {
    actionsRef.current.reload();
  });

  const updateProductStateFC = (innerProductState: 1 | 2) => {
    execUpdateProductState({
      modal,
      selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
      state: productState,
      onOk: () => {
        runRequest(() =>
          batchUpdateProductState({
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

  const handleChangeStatus = ({
    dataSource: { row },
    value,
  }: SwitchOnChangeParams<ProductColumns, { productState: 1 | 2 }>) =>
    updateProductState({ id: row.id, ...value }).then(() => actionsRef.current.reload());

  const handleTableChange = useCallback(
    (_pagination: any, _filters: any, sorter: SorterResult<ProductColumns>) => {
      actionsRef.current.reload(getSearchFormData(_pagination, _filters, sorter));
    },
    [],
  );

  const handleCreateEditSuccess = useCallback(() => actionsRef.current.clearTableSelected(), []);

  const { openForm, ModalFormElement } = useEditGroupsForm({
    onAddSuccess: handleCreateEditSuccess,
    productList: actionsRef.current.selectedRowKeys,
    productType: 0,
  });

  const handleEditGroups = () => {
    if (actionsRef.current.selectedRowKeys?.length < 1)
      return message.warning('请勾选需要操作的商品！');
    return openForm();
  };

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
    return Fn({ productInfoIds: actionsRef.current.selectedRowKeys, productType: 0 });
  };

  return (
    <Spin spinning={isLoading}>
      {ModalContext}
      {ModalFormElement}
      {ModalStockElement}
      {ModalWarningElement}

      <GeneralTableLayout<ProductColumns>
        request={(params) => getProducts({ ...params, productState })}
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
              brandId: {
                title: '商品品牌',
                type: 'string',
                col: 8,
                'x-component-props': {
                  dataSource: brandsSelectOptions,
                  showSearch: true,
                  filterOption: stringFilterOption,
                  placeholder: '请选择商品品牌',
                },
              },
              // shareProfit: {
              //   title: '是否分润',
              //   type: 'checkableTags',
              //   props: {
              //     options: generateDefaultSelectOptions([
              //       { label: '分润商品', value: 1 },
              //       { label: '不分润商品', value: 0 },
              //     ])
              //   },
              // },
              // sample: {
              //   title: '是否上样',
              //   type: 'checkableTags',
              //   props: {
              //     options: generateDefaultSelectOptions([
              //       { label: '支持上样', value: 1 },
              //       { label: '不支持上样', value: 0 },
              //     ]),
              //   },
              // },
            },
            {
              groupId: {
                title: '商品分组',
                type: 'string',
                col: 8,
                'x-component-props': {
                  dataSource: groupsSelectOptions,
                  showSearch: true,
                  filterOption: stringFilterOption,
                  placeholder: '请选择分组',
                },
              },
            },
            // {
            //   mini: {
            //     title: '出售平台',
            //     type: 'checkableTags',
            //     props: {
            //       options: generateDefaultSelectOptions([
            //         { label: '已上架小程序', value: 1 },
            //         { label: '未上架小程序', value: 0 },
            //       ]),
            //     },
            //   },
            // },
          ],
        }}
        operationButtonListProps={{
          list: [
            {
              text: '修改分组',
              onClick: () => handleEditGroups(),
            },
            {
              text: '新增商品',
              type: 'primary',
              onClick: () => goToFormPage(),
            },
          ],
        }}
        // defaultAddOperationButtonListProps={{
        //   text: '新增商品',
        //   onClick: () => goToFormPage(),
        // }}
        selectedRowsAlertProps={{
          alertOptionRender: (props) =>
            AlertOptionRender({
              props,
              handler: updateProductStateFC,
              productState,
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
            title: '单位',
            dataIndex: ['chargeUnit', 'chargeUnitName'],
            width: 100,
          },
          {
            title: '商品价格',
            sorter: true,
            dataIndex: 'minSalePrice',
            defaultSortOrder: 'descend',
            render: (_, item) =>
              showPriceOrBetween(item.minVipPurchasePrice, item.maxPurchasePrice),
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
            dataIndex: 'productState',
            width: 100,
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
              list: ({ row }) => [
                { text: '查看', onClick: () => goToViewPage(row.id) },
                { text: '编辑', onClick: () => goToFormPage(row) },
              ],
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
