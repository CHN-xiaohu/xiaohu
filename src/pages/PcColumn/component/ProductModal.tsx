import { GeneralTableLayout } from '@/components/Business/Table';

import { useStoreState } from '@/foundations/Model/Hooks/Model';
// import { Image } from '@/components/Business/Table/Image';
import { handleSelectionArray } from '@/utils';

import { Modal } from 'antd';

import { modelNamespace } from '../Constant';

import type { PcColumnColumns } from '../Api';
import { getSelectArrayProduct } from '../Api';

const ProductModal = ({ ...productOpt }: any) => {
  const { tempRowProducts, selectedProductRowKeys, categoriesTree } = useStoreState(
    modelNamespace as 'pcColumn',
  );

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
    return getSelectArrayProduct({ ...query });
  };

  const handleSelectAll = (selected: any, selectedRows: any, changeRows: any[]) => {
    const newTempRowProducts: any[] = handleSelectionArray(
      selected,
      selectedRows,
      changeRows,
      tempRowProducts,
      'productInfoId',
    );

    window.$fastDispatch((model) => model[modelNamespace].updateState, {
      selectedProductRowKeys: newTempRowProducts.map((item: any) => item?.productInfoId),
      tempRowProducts: newTempRowProducts,
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  return (
    <Modal {...productOpt}>
      <GeneralTableLayout<PcColumnColumns, any>
        request={request as any}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              productName: {
                title: '商品名称',
                type: 'string',
                'x-props': {
                  placeholder: '商品名称',
                },
              },
              categoryId: {
                title: '商品类目',
                type: 'treeSelect',
                'x-props': {
                  placeholder: '选择类目',
                  treeData: categoriesTree,
                  showSearch: true,
                  treeNodeFilterProp: 'title',
                  treeDefaultExpandAll: true,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '商品名称',
            dataIndex: 'productName',
          },
          {
            title: '类目',
            dataIndex: 'treeNamePath',
          },
        ]}
        tableProps={{
          rowKey: 'productInfoId',
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
