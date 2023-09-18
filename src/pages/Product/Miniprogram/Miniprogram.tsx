import type { SwitchOnChangeParams } from '@/components/Business/Table';
import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { MoneyText } from '@/components/Library/MoneyText';
import type { SorterResult } from 'antd/lib/table/interface';
import { UserInfoCache } from '@/services/User';

import { history } from 'umi';
import { useCallback, useState } from 'react';

import { Spin, Modal, Tag, message } from 'antd';

import { useLoadingWrapper } from '@/foundations/hooks';
import { Ellipsis } from '@app_components/Library/Ellipsis';

import { useMount } from 'ahooks';

import { useMiniprogramProductQR } from './MiniprogramProductQR';

import { useSelectProductByModal } from './useSelectProductByModal';

import { useSelectBrandProductByModal } from './BrandSelectProduct';

import type { MiniprogramProductColumns, TenantCodeUserColumns } from '../Api';
import {
  updateMiniprogramProductState,
  batchUpdateMiniprogramProductState,
  getMiniprogramProducts,
  getBelongFirstDefaultDomain,
  getBelongChannel,
} from '../Api';

import { getSearchFormData, execUpdateProductState } from '../Manager/Common';
import { stringFilterOption } from '../Manager/Form/Fields/ProductInfoLayout';
import { AlertOptionRender } from '../Manager/AlertOptionRender';
import type { SupplyProductProps } from '../Supply/Supply';
import { useEditGroupsForm } from '../Manager/Form/components/FormFields/GroupsFrom';
import { useEditStockForm, useEditWarningForm } from '../components/ModifyProductsInBulk';

export function Miniprogram({
  productState: miniProductState,
  upperAndLowerShelves$,
  brandsSelectOptions,
  groupsSelectOptions,
}: SupplyProductProps) {
  const userInfo = UserInfoCache.get();
  const { categories } = useStoreState('productCategory');
  const { actionsRef } = useGeneralTableActions<MiniprogramProductColumns>();
  const { isLoading, runRequest } = useLoadingWrapper();
  const [modal, ModalContext] = Modal.useModal();
  const [isBelongChannel, setIsBelongChannel] = useState(false);

  const { openMiniprogramProductQR, MiniprogramProductQRElement } = useMiniprogramProductQR();

  const goToFormPage = (item?: MiniprogramProductColumns) => {
    history.push({
      pathname: `/product/miniprogram/form${(item?.id && `/${item.id}`) || ''}`,
    });
  };

  const handleRetweetProduct = (item?: MiniprogramProductColumns) => {
    history.push({
      pathname: `/product/miniprogram/form${(item?.id && `/${item.id}`) || ''}`,
      query: {
        isImportFromProduct: true,
      },
    });

    return Promise.resolve();
  };

  useMount(() => {
    getBelongChannel(userInfo.tenantCode).then((res) => {
      const tenantCodeData = res.data as TenantCodeUserColumns;
      if (
        tenantCodeData.belongChannel !== '0' &&
        tenantCodeData.belongChannel !== undefined &&
        tenantCodeData.versionType === 1
      ) {
        setIsBelongChannel(true);
      }
    });
  });

  const { openSelectProduct, SelectProductElement } = useSelectProductByModal({
    onSubmit: handleRetweetProduct,
  });

  const { openSelectBrandProduct, SelectBrandProductElement } = useSelectBrandProductByModal({});

  upperAndLowerShelves$.useSubscription(() => {
    actionsRef.current.reload();
  });

  // 批量上下架
  const handleUpdateProductState = (innerProductState: 1 | 2) => {
    execUpdateProductState({
      modal,
      selectedRowKeys: actionsRef.current.selectedRowKeys as string[],
      state: miniProductState,
      onOk: () => {
        runRequest(() =>
          batchUpdateMiniprogramProductState({
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
  }: SwitchOnChangeParams<MiniprogramProductColumns, { miniProductState: 1 | 2 }>) =>
    updateMiniprogramProductState({ id: row.id, ...value }).then(() => actionsRef.current.reload());

  const handleTableChange = useCallback(
    (_pagination: any, _filters: any, sorter: SorterResult<MiniprogramProductColumns>) => {
      actionsRef.current.reload(getSearchFormData(_pagination, _filters, sorter));
    },
    [],
  );

  const handleEditGroupsSuccess = useCallback(() => actionsRef.current.clearTableSelected(), []);

  const { openForm, ModalFormElement } = useEditGroupsForm({
    onAddSuccess: handleEditGroupsSuccess,
    productList: actionsRef.current.selectedRowKeys,
    productType: 1,
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
    return Fn({ productInfoIds: actionsRef.current.selectedRowKeys, productType: 1 });
  };

  const handleGoPcPurchase = () => {
    getBelongFirstDefaultDomain(userInfo.tenantCode).then((res) => {
      const { data } = res;
      if (data.domainUrl) {
        const openUrl = `${data.isHttps !== 0 ? 'https' : 'http'}://${data.domainUrl.trim()}`;
        window.open(openUrl);
      } else {
        message.warning('暂无商城域名！');
      }
    });
  };

  return (
    <Spin spinning={isLoading}>
      {SelectProductElement}
      {MiniprogramProductQRElement}
      {ModalContext}
      {ModalFormElement}
      {ModalStockElement}
      {ModalWarningElement}
      {SelectBrandProductElement}

      <GeneralTableLayout<MiniprogramProductColumns>
        request={(params) => getMiniprogramProducts({ ...params, miniProductState })}
        getActions={actionsRef}
        searchProps={{
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
                  // treeDefaultExpandAll: true,
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
              onClick: () => goToFormPage(),
              type: 'primary',
              icon: 'PlusOutlined',
            },
            {
              text: '同步采购商品',
              onClick: () => openSelectProduct(),
              icon: 'RetweetOutlined',
            },
            {
              text: '品牌总部商品选品上架',
              onClick: () => openSelectBrandProduct(),
              icon: 'RetweetOutlined',
              visible: isBelongChannel,
            },
            {
              text: '品牌商品采购',
              onClick: () => handleGoPcPurchase(),
              icon: 'RetweetOutlined',
              visible: isBelongChannel,
            },
          ],
        }}
        selectedRowsAlertProps={{
          alertOptionRender: (props) =>
            AlertOptionRender({
              props,
              handler: handleUpdateProductState,
              productState: miniProductState,
              modifyStock: () => handleEditFn(handleOpenEditStockForm),
              modifyWarning: () => handleEditFn(handleOpenEditWarningForm),
            }),
        }}
        columns={[
          {
            title: '序号',
            dataIndex: 'serial',
            width: 80,
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
            render: (value, row) => (
              <div className="flex" style={{ width: '100%' }}>
                <Ellipsis minWidth={60}>{value}</Ellipsis>
                {!row.productType && (
                  <Tag color="blue" style={{ margin: 0 }}>
                    采购商品
                  </Tag>
                )}
              </div>
            ),
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
            dataIndex: 'minSalePrice',
            sorter: true,
            defaultSortOrder: 'descend',
            render: (value, item) => {
              if (value === item.maxSalePrice) {
                return <MoneyText>{value}</MoneyText>;
              }

              return (
                <span>
                  <MoneyText>{value}</MoneyText> ~ <MoneyText>{item.maxSalePrice}</MoneyText>
                </span>
              );
            },
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
              list: ({ row }) => [
                { text: '编辑', onClick: () => goToFormPage(row) },
                {
                  text: '推广',
                  onClick: () => openMiniprogramProductQR({ id: row.id, name: row.name }),
                },
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
