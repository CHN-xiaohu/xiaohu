import {
  GeneralTableLayout,
  useGeneralTableActions,
  // generateDefaultSelectOptions
} from '@/components/Business/Table';

// import { useZWXExclusiveTable } from '@/foundations/Hooks/Antd/useZWXExclusiveTable'
// import { SearchFromProps } from '@/components/Business/Form/SearchForm'
import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { Image } from '@/components/Business/Table/Image';
import { handleSelectionArray } from '@/utils';

import { Modal } from 'antd';
import { useDispatch } from 'umi';

import type { productColumns } from '../Api';
import { getProductList, getMiniProduct } from '../Api';

import { handlePrice, handleIsMiniCoupon } from '../Util';

const ProductModal = ({ ...productOpt }: any) => {
  const { actionsRef } = useGeneralTableActions<productColumns>();

  const { productCategories, selectedProductRowKeys, tempRowProducts, storeId } = useStoreState(
    'coupon',
  );
  const dispatch = useDispatch();

  const request = (params: any) => {
    const query = {
      size: params.pageSize,
      current: params.current,
      categoryId: params.categoryId || params.category2Id || params.category3Id,
      ...params,
    };
    query.category2Id = undefined;
    query.category3Id = undefined;
    if (handleIsMiniCoupon()) {
      query.storeId = storeId;
    }

    const requestUrl = handleIsMiniCoupon() ? getMiniProduct : getProductList;

    return requestUrl({ ...query });
  };

  const handleSelectAll = (selected: any, selectedRows: any, changeRows: any[]) => {
    const newTempRowProducts: any[] = handleSelectionArray(
      selected,
      selectedRows,
      changeRows,
      tempRowProducts,
      'id',
    );

    dispatch({
      type: 'coupon/updateState',
      payload: {
        selectedProductRowKeys: newTempRowProducts.map((item: any) => item?.id),
        tempRowProducts: newTempRowProducts,
      },
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  return (
    <Modal {...productOpt}>
      <GeneralTableLayout<productColumns, any>
        request={request as any}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              name: {
                type: 'string',
                title: '商品名称',
                'x-component-props': {
                  placeholder: '请输入商品名称',
                },
              },
              category3Id: {
                title: '商品类目',
                type: 'treeSelect',
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: productCategories,
                  // treeDefaultExpandAll: true,
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '商品图',
            dataIndex: 'image',
            render: (src: string) => <Image src={src} />,
          },
          {
            title: '商品名称',
            dataIndex: 'name',
            width: '35%',
          },
          {
            title: '类目',
            dataIndex: 'categoryNamePath',
            width: '25%',
          },
          {
            title: '单位',
            dataIndex: 'chargeUnit',
            render: (data) => <span>{data?.chargeUnitName}</span>,
          },
          {
            title: '采购价',
            dataIndex: 'minPurchasePrice',
            visible: !handleIsMiniCoupon(),
            render: (data: any, records: any) => (
              <span>￥{handlePrice(data, records.maxPurchasePrice)}</span>
            ),
          },
          {
            title: '零售价',
            dataIndex: 'minSalePrice',
            visible: handleIsMiniCoupon(),
            render: (data: any, records: any) => (
              <span>￥{handlePrice(data, records.maxSalePrice)}</span>
            ),
          },
        ]}
        operationButtonListProps={false}
        tableProps={{
          rowSelection: {
            selectedRowKeys: selectedProductRowKeys,
            onSelect: handleSelectChange,
            onSelectAll: handleSelectAll,
          },
        }}
      />
    </Modal>
  );
};

export default ProductModal;
