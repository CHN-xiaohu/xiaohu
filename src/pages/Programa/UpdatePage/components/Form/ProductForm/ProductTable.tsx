import { ButtonList } from '@/components/Library/ButtonList';

import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { useRef, useState } from 'react';
import { Table, Input, Modal } from 'antd';
import { cloneDeep } from 'lodash';
import { useDispatch } from 'dva';

import { handlePrice } from '../../../../Utils';

export default () => {
  const { selectRowProducts, selectedProductRowKeys, type } = useStoreState('programa');

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const selectedIndex = useRef(0);

  const handleSortChange = (value: any, id: any) => {
    const newList = cloneDeep(selectRowProducts);
    newList.forEach((items: any) => {
      if (items.productInfoId === id) {
        items.actionSort = value;
      }
    });
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowProducts: newList,
      },
    });
  };

  const handleToggleIsFirst = (id: any) => {
    const newList = cloneDeep(selectRowProducts);
    newList.forEach((items: any) => {
      if (items.productInfoId === id) {
        items.isFirst = !items.isFirst;
      }
    });
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowProducts: newList,
      },
    });
  };

  const handleItemRemove = (id: any) => {
    const newList = cloneDeep(selectRowProducts);
    newList.forEach((items: any, index: number) => {
      if (items.productInfoId === id) {
        selectedIndex.current = index;
      }
    });
    setShowModal(true);
  };

  const handleSubmitRemove = () => {
    setShowModal(false);
    const newList = cloneDeep(selectRowProducts);
    const newKeyList = cloneDeep(selectedProductRowKeys);
    newList.splice(selectedIndex.current, 1);
    newKeyList.splice(selectedIndex.current, 1);
    dispatch({
      type: 'programa/updateState',
      payload: {
        selectRowProducts: newList,
        tempRowProducts: newList,
        selectedProductRowKeys: newKeyList,
      },
    });
  };

  const handleCancelRemove = () => {
    setShowModal(false);
  };

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'productName',
      width: '30%',
    },
    {
      title: '商品价格',
      dataIndex: 'minPrice',
      width: '30%',
      render: (data: any, records: any) => (
        <span>
          ￥{handlePrice(data, records.maxPrice)}/{records.chargeUnitName}
        </span>
      ),
      // render: (_: any, records: any) => (
      //   <span>
      //     {`￥${records.minPrice}/${records.chargeUnitName} ~ ￥${records.maxPrice}/${records.chargeUnitName}`}
      //   </span>
      // ),
    },
    {
      title: '展示排序',
      dataIndex: 'actionSort',
      width: '10%',
      align: 'center',
      render: (value: any, records: any) =>
        !records.isFirst ? (
          <span>---</span>
        ) : (
          <Input
            style={{ textAlign: 'center' }}
            type="number"
            value={value}
            onChange={(e) => handleSortChange(e.target.value, records.productInfoId)}
          />
        ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      width: '30%',
      render: (_: any, records: any) => {
        const list = [
          records.isFirst
            ? {
                text: '取消显示',
                onClick: () => {
                  handleToggleIsFirst(records.productInfoId);
                },
              }
            : {
                text: '首页展示',
                onClick: () => {
                  handleToggleIsFirst(records.productInfoId);
                },
              },
          {
            text: '删除',
            onClick: () => {
              handleItemRemove(records.productInfoId);
            },
          },
        ];
        return <ButtonList isLink list={list} />;
      },
    },
  ];

  return type.includes('PRODUCT') ? (
    <>
      <Modal
        title="提示"
        visible={showModal}
        onOk={handleSubmitRemove}
        onCancel={handleCancelRemove}
      >
        确定删除展示商品？
      </Modal>
      <Table
        bordered
        rowKey={(_: any, i: number) => String(i)}
        pagination={{
          pageSize: 10,
          total: selectRowProducts.length,
          showTotal: (total: number) => `共 ${total} 个`,
        }}
        columns={columns as any}
        dataSource={selectRowProducts}
      />
    </>
  ) : null;
};
