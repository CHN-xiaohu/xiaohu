import { GeneralTableLayout } from '@/components/Business/Table';
import * as api from '@/pages/Programa/Api';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { handleSelectionArray } from '@/utils';

import { Modal } from 'antd';

const AddProductForm = () => {
  const {
    showProduction,
    selectedProductRowKeys,
    prevSelectedProductRowKeys,
    selectRowProducts,
  } = useStoreState('programa');

  const { categoriesList, tempRowProducts } = useStoreState('programa');

  const request = (params: any) => {
    const thirdCategoryId = params?.thirdCategoryId?.pop();
    const query = {
      size: params.pageSize,
      current: params.current,
      ...params,
      thirdCategoryId,
    };
    return api.getColumnProduct({ ...query });
  };

  // 默认首页排序
  const addDefaultIsFirstBeforeUpdate = (arr: any[] | null) => {
    // const sort = 1;
    let proMap = {};
    const proList: any = [];
    (arr || []).forEach((e) => {
      const target = selectRowProducts.find(
        (item: any) => item.productInfoId === e.productInfoId,
      ) as any;
      // e.isFirst = target?.isFirst || 0;
      // e.actionSort = target?.actionSort || null;
      // sort += 1
      proMap = {
        isFirst: target?.isFirst || 0,
        actionSort: target?.actionSort || null,
        ...e,
      };
      proList.push(proMap);
    });
    return proList;
  };

  const handleSubmit = () => {
    window.$fastDispatch((model) => model.programa.updateState, {
      selectRowProducts: addDefaultIsFirstBeforeUpdate(tempRowProducts),
      showProduction: false,
    });
  };

  const handleCancel = () => {
    window.$fastDispatch((model) => model.programa.updateState, {
      showProduction: false,
      selectedProductRowKeys: prevSelectedProductRowKeys,
    });
  };

  const handleSelectAll = (selected: any, selectedRows: any, changeRows: any[]) => {
    const newTempRowProducts: any[] = handleSelectionArray(
      selected,
      selectedRows,
      changeRows,
      tempRowProducts,
      'productInfoId',
    );

    window.$fastDispatch((model) => model.programa.updateState, {
      selectedProductRowKeys: newTempRowProducts.map((item: any) => item?.productInfoId),
      tempRowProducts: newTempRowProducts,
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  return (
    <Modal
      width={1000}
      visible={showProduction}
      onOk={handleSubmit}
      onCancel={handleCancel}
      title="选择商品"
    >
      <GeneralTableLayout<any>
        request={request as any}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              productName: {
                type: 'string',
                title: '商品名称',
                placeholder: '请输入商品名称',
              },
              thirdCategoryId: {
                type: 'cascader',
                title: '商品类目',
                placeholder: '请选择商品类目',
                props: {
                  options: categoriesList,
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '商品名称',
            dataIndex: 'productName',
            width: '45%',
          },
          {
            title: '类目',
            dataIndex: 'category',
            width: '45%',
            render: (_: any, records: any) => <span>{records.treeNamePath}</span>,
          },
        ]}
        tableProps={{
          rowSelection: {
            selectedRowKeys: selectedProductRowKeys,
            onSelect: handleSelectChange,
            onSelectAll: handleSelectAll,
          },
          rowKey: 'productInfoId',
        }}
      />
    </Modal>
  );
};

export default AddProductForm;
