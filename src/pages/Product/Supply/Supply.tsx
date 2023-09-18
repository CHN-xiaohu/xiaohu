import { memo, useCallback } from 'react';
import {
  GeneralTableLayout,
  useGeneralTableActions,
  convenientDateRangeSchema,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import type { SorterResult } from 'antd/lib/table/interface';
import { Spin, Modal, message } from 'antd';
import { history } from 'umi';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useLoadingWrapper } from '@/foundations/hooks';

import { Question } from '@/pages/Dashboard/Workplace';

import { auditStatusMap, auditStatusColorMap } from './Constants';

import {
  getSupplyProducts,
  batchUpdateSupplyProductState,
  submitSupplyProductReview,
} from '../Api';
import { getSearchFormData, execUpdateProductState, showPriceOrBetween } from '../Manager/Common';
import { useSelectProductByModal } from '../Miniprogram/useSelectProductByModal';
import { stringFilterOption } from '../Manager/Form/Fields/ProductInfoLayout';
import { AlertOptionRender } from '../Manager/AlertOptionRender';
import type { TBrandsSelectOptions } from '../useBrandsToSelectOptions';
import type { ProductManagerProps } from '../Manager/Product';
import { useEditStockForm, useEditWarningForm } from '../components/ModifyProductsInBulk';

export type SupplyProductProps = {
  brandsSelectOptions: TBrandsSelectOptions;
  groupsSelectOptions: TBrandsSelectOptions;
} & ProductManagerProps;

const auditStatusSchema = {
  auditStatus: {
    title: '审核状态',
    type: 'checkableTags' as 'checkableTags',
    'x-component-props': {
      options: generateDefaultSelectOptions(
        Object.keys(auditStatusMap).map((value) => ({ label: auditStatusMap[value], value })),
      ),
    },
  },
};

export const Supply = memo(
  ({ productState = 1, upperAndLowerShelves$, brandsSelectOptions }: SupplyProductProps) => {
    const { categories } = useStoreState('productCategory');
    const { actionsRef } = useGeneralTableActions();
    const { isLoading, runRequest } = useLoadingWrapper();
    const [modal, ModalContext] = Modal.useModal();

    // 是否下架
    const isNotShelves = productState === 2;

    const goToFormPage = (item?: any) => {
      history.push(`/product/supply/form${(item?.id && `/${item.id}`) || ''}`);
    };

    const goToViewPage = (id: string) => {
      history.push(`/product/supply/view/${id}`);
    };

    upperAndLowerShelves$.useSubscription(() => {
      actionsRef.current.reload();
    });

    const { openSelectProduct, SelectProductElement } = useSelectProductByModal({
      title: '复制采购商品至供货商品',
      getProductsDefaultParams: { productState: 1 },
      onSubmit: (row) => {
        history.push(`/product/supply/form?copyProductId=${row.id}`);

        return Promise.resolve();
      },
    });

    const {
      openSelectProduct: openSelectMiniProduct,
      SelectProductElement: SelectMiniProductElement,
    } = useSelectProductByModal({
      title: '复制小程序商品至供货商品',
      isMiniProgram: true,
      getProductsDefaultParams: { miniProductState: 1 },
      onSubmit: (row) => {
        history.push(`/product/supply/form?copyMiniProductId=${row.id}`);

        return Promise.resolve();
      },
    });

    // 批量上下架
    const handleUpdateProductState = (innerProductState: 1 | 2) => {
      execUpdateProductState({
        modal,
        selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
        state: productState,
        onOk: () => {
          runRequest(() =>
            batchUpdateSupplyProductState({
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

    const handleSubmitReview = useCallback((id: string) => {
      runRequest(() =>
        submitSupplyProductReview(id).then(() => {
          actionsRef.current.reload();
        }),
      );
    }, []);

    const handleTableChange = useCallback(
      (_pagination: any, _filters: any, sorter: SorterResult<any>) => {
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
      return Fn({ productInfoIds: actionsRef.current.selectedRowKeys, productType: 2 });
    };

    return (
      <Spin spinning={isLoading}>
        {ModalContext}
        {SelectProductElement}
        {SelectMiniProductElement}
        {ModalStockElement}
        {ModalWarningElement}

        <GeneralTableLayout
          {...{
            request: (params) => getSupplyProducts({ ...params, productState }),
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
                  '[startDate,endDate]': convenientDateRangeSchema({ title: '添加时间' }),
                },
                {
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
                  brandId: {
                    title: '商品品牌',
                    type: 'string',
                    'x-component-props': {
                      dataSource: brandsSelectOptions,
                      showSearch: true,
                      filterOption: stringFilterOption,
                      placeholder: '请选择商品品牌',
                    },
                  },
                  ...(isNotShelves ? {} : auditStatusSchema),
                },
              ],
            },
            operationButtonListProps: {
              list: [
                {
                  text: '新增商品',
                  onClick: () => goToFormPage(),
                  type: 'primary',
                  icon: 'PlusOutlined',
                },
                {
                  text: '复制商品上架',
                  onClick: () => openSelectProduct(),
                  icon: 'RetweetOutlined',
                },
                {
                  text: '复制小程序商品上架',
                  onClick: () => openSelectMiniProduct(),
                  icon: 'RetweetOutlined',
                },
              ],
            },
            selectedRowsAlertProps: {
              alertOptionRender: (props) =>
                AlertOptionRender({
                  props,
                  handler: handleUpdateProductState,
                  productState,
                  modifyStock: () => handleEditFn(handleOpenEditStockForm),
                  modifyWarning: () => handleEditFn(handleOpenEditWarningForm),
                }),
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
                title: '建议零售价',
                dataIndex: 'minSalePrice',
                render: (_, item) =>
                  showPriceOrBetween(item.minSuggestSalePrice, item.maxSuggestSalePrice),
              },
              {
                title: '添加时间',
                dataIndex: 'createTime',
                sorter: true,
                defaultSortOrder: 'descend',
                width: 184,
              },
              {
                title: '审核状态',
                dataIndex: 'auditStatus',
                visible: !isNotShelves,
                render: (type: number, row: any) => (
                  <span style={{ color: auditStatusColorMap[type] }}>
                    {auditStatusMap[type]}

                    {!!row.auditRemark && (
                      <Question
                        iconStyle={{ marginLeft: 6 }}
                        title=""
                        dataSource={[row.auditRemark]}
                      />
                    )}
                  </span>
                ),
              },
              {
                title: '操作',
                dataIndex: 'id',
                width: 188,
                buttonListProps: {
                  list: ({ row }) => [
                    { text: '查看', onClick: () => goToViewPage(row.id) },
                    {
                      text: '编辑',
                      visible: row.auditStatus !== 0 || isNotShelves,
                      onClick: () => goToFormPage(row),
                    },
                    {
                      text: '提交审核',
                      visible: [-1, 1, 2].includes(row.auditStatus) && !isNotShelves,
                      modalProps: {
                        content: (
                          <>
                            <p>确定提交审核吗？</p>
                            <p>审核通过后，才会更新到集采中心</p>
                          </>
                        ),
                        onOk: () => handleSubmitReview(row.id),
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
