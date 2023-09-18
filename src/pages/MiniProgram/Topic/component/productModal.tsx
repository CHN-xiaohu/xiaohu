import { GeneralTableLayout } from '@/components/Business/Table';

import { useStoreState } from '@/foundations/Model/Hooks/Model';
import { Image } from '@/components/Business/Table/Image';

import { Modal, Button } from 'antd';
import { useDispatch } from 'umi';
import { handleSelectionArray } from '@/utils';

import type { productColumns } from '../Api';
import { getProductList } from '../Api';

const ProductModal = ({ onOk, onCancel, ...productOpt }: any) => {
  const { productCategories, tempRowProducts, selectedProductRowKeys } = useStoreState('topic');
  const dispatch = useDispatch();

  const request = (params: any) => {
    const query = {
      miniProductState: 1,
      size: params.pageSize,
      current: params.current,
      categoryId: params.categoryId || params.category2Id || params.category3Id,
      ...params,
    };
    query.category2Id = undefined;
    query.category3Id = undefined;
    return getProductList({ ...query });
  };

  const handlePrice = (min: any, max: any) => {
    if (min === max) {
      return min;
    }
    return `${min}~${max}`;
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
      type: 'topic/updateState',
      payload: {
        selectedProductRowKeys: newTempRowProducts.map((item: any) => item?.id),
        tempRowProducts: newTempRowProducts,
      },
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  const tableFooter = (
    <div>
      最多可选商品200个，已选：商品（
      <span style={{ color: 'red' }}>{selectedProductRowKeys.length}</span>）个
      <Button onClick={onOk} style={{ marginLeft: '10px' }} type="primary">
        确定
      </Button>
      <Button onClick={onCancel}>取消</Button>
    </div>
  );

  return (
    <Modal footer={tableFooter} onCancel={onCancel} {...productOpt}>
      <GeneralTableLayout<productColumns, any>
        request={request as any}
        operationButtonListProps={false}
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
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                'x-component-props': {
                  placeholder: '请选择商品类目',
                  treeData: productCategories,
                  treeDefaultExpandAll: true,
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
            dataIndex: 'chargeUnitName',
            render: (data: any, records: any) => {
              return <span>{data || records?.chargeUnit?.chargeUnitName}</span>;
            },
          },
          {
            title: '采购价',
            dataIndex: 'minSalePrice',
            render: (data: any, records: any) => (
              <span>￥{handlePrice(data, records.maxSalePrice)}</span>
            ),
          },
        ]}
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
