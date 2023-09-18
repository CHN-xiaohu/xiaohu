import { GeneralTableLayout } from '@/components/Business/Table';
import { getCategories } from '@/pages/Programa/Api';
import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { handleSelectionArray } from '@/utils';

import { Modal, message } from 'antd';

const AddCategoryForm = () => {
  const {
    showCategory,
    selectedCategoryRowKeys,
    selectRowCategories,
    tempSelectedRowCategories,
    prevSelectedCategoriesRowKeys,
  } = useStoreState('programa');

  const request = (params: any) =>
    getCategories({
      size: params.pageSize,
      ...params,
      content: params.content || '',
    });

  const updateState = (payload: any) => {
    window.$fastDispatch((model) => model.programa.updateState, payload);
  };

  // 默认填充
  const addDefaultProductNumBeforeSubmit = (arr: any[] | null) => {
    let i = 0;
    let cateMap = {};
    const cateList: any = [];
    (arr || []).forEach((e) => {
      const target = (selectRowCategories || []).find(
        (item: any) => item.thirdCategoryId === e.thirdCategoryId,
      ) as any;
      // e.productNum = target?.productNum || 10;
      // e.actionSort = target?.actionSort || (i += 1);
      cateMap = {
        productNum: target?.productNum || 10,
        actionSort: target?.actionSort || (i += 1),
        ...e,
      };
      cateList.push(cateMap);
    });
    return cateList;
  };

  const handleSubmit = () => {
    window.$fastDispatch((model) => model.programa.updateState, {
      selectRowCategories: addDefaultProductNumBeforeSubmit(tempSelectedRowCategories),
      showCategory: false,
    });
  };

  const handleSelectAll = (selected: any, selectedRows: any, changeRows: any[]) => {
    const newTempRowProducts: any[] = handleSelectionArray(
      selected,
      selectedRows,
      changeRows,
      tempSelectedRowCategories,
      'thirdCategoryId',
    );

    if (selectedCategoryRowKeys.length > 9 && selected) {
      message.warn('分类最多可以添加10个');
      return;
    }

    window.$fastDispatch((model) => model.programa.updateState, {
      selectedCategoryRowKeys: newTempRowProducts.map((item: any) => item?.thirdCategoryId),
      tempSelectedRowCategories: newTempRowProducts,
    });
  };

  const handleSelectChange = (record: any, selected: boolean) => {
    handleSelectAll(selected, [], [record]);
  };

  return (
    <Modal
      width={1000}
      visible={showCategory}
      onOk={handleSubmit}
      onCancel={() =>
        updateState({
          showCategory: false,
          selectedCategoryRowKeys: prevSelectedCategoriesRowKeys,
        })
      }
      title="选择类目"
    >
      <GeneralTableLayout<any>
        request={request as any}
        operationButtonListProps={false}
        searchProps={{
          items: [
            {
              content: {
                type: 'string',
                title: '类目名称',
                'x-component-props': {
                  placeholder: '请输入搜索关键词',
                },
              },
            },
          ],
        }}
        columns={[
          {
            title: '类目商品',
            dataIndex: 'treeNamePath',
            width: '45%',
          },
          {
            title: '类目商品',
            dataIndex: 'num',
            width: '45%',
          },
        ]}
        tableProps={{
          rowSelection: {
            selectedRowKeys: selectedCategoryRowKeys,
            onSelect: handleSelectChange,
            onSelectAll: handleSelectAll,
          },
          rowKey: 'thirdCategoryId',
        }}
      />
    </Modal>
  );
};

export default AddCategoryForm;
