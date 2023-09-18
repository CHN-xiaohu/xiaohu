import { ButtonList } from '@/components/Library/ButtonList';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useRef, useState } from 'react';
import { Table, Input, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import { useDispatch } from 'dva';

export default () => {
  const { selectRowCategories, type, selectedCategoryRowKeys } = useStoreState('programa');
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const selectedIndex = useRef(0);

  const handleSortChange = (value: any, index: number) => {
    const newList = cloneDeep(selectRowCategories);
    (newList[index] as any).actionSort = Number(value);
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowCategories: newList,
      },
    });
  };

  const handleNumChange = (value: any, index: number) => {
    const newList = cloneDeep(selectRowCategories);
    (newList[index] as any).productNum = Number(value);
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowCategories: newList,
      },
    });
  };

  const handleItemRemove = (index: number) => {
    selectedIndex.current = index;
    setShowModal(true);
  };

  const handleSubmitRemove = () => {
    const newList = cloneDeep(selectRowCategories);
    const newKeyList = cloneDeep(selectedCategoryRowKeys);
    newList.splice(selectedIndex.current, 1);
    newKeyList.splice(selectedIndex.current, 1);
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowCategories: newList,
        selectedCategoryRowKeys: newKeyList,
        tempSelectedRowCategories: newList,
      },
    });
    setShowModal(false);
  };

  const handleCancelRemove = () => {
    setShowModal(false);
  };

  const columns = [
    {
      title: '一级类目',
      dataIndex: 'treeNamePath',
    },
    {
      title: '展示排序',
      dataIndex: 'actionSort',
      width: '10%',
      align: 'center',
      render: (_: any, records: any, index: number) => (
        <Input
          style={{ textAlign: 'center' }}
          type="number"
          onChange={(e) => handleSortChange(e.target.value, index)}
          value={records.actionSort}
        />
      ),
    },
    {
      title: '显示商品个数',
      dataIndex: 'productNum',
      width: '10%',
      align: 'center',
      render: (_: any, records: any, index: number) => (
        <Input
          style={{ textAlign: 'center' }}
          type="number"
          value={records.productNum}
          onChange={(e) => handleNumChange(e.target.value, index)}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '20%',
      render: (_: any, __: any, index: number) => {
        const list = [
          {
            text: '删除',
            onClick: () => {
              handleItemRemove(index);
            },
          },
        ];
        return <ButtonList isLink list={list} />;
      },
    },
  ];

  return type.includes('CATEGORY') ? (
    <>
      <Modal
        title="提示"
        visible={showModal}
        onOk={handleSubmitRemove}
        onCancel={handleCancelRemove}
      >
        确定删除分类？
      </Modal>
      <Table
        bordered
        rowKey={(_: any, i: number) => String(i)}
        pagination={false}
        columns={columns as any}
        dataSource={selectRowCategories}
      />
    </>
  ) : null;
};
