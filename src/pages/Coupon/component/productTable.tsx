import { ButtonList } from '@/components/Library/ButtonList';

import { Image } from '@/components/Business/Table/Image';

import { useRef, useState } from 'react';
import { Table, Button, Modal } from 'antd';
import { useDispatch } from 'dva';
import { cloneDeep } from 'lodash';

import { handlePrice, handleIsMiniCoupon } from '../Util';

import Styles from '../style.less';

const ProductTable = ({
  onOpenProductModal,
  tempRowProducts,
  selectedProductRowKeys,
  selectRowProducts,
}: // detailTotal,
// pageChange,
// detailCurrent,
any) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const selectedIndex = useRef(0);

  const handleItemRemove = (index: number) => {
    selectedIndex.current = index;
    setShowModal(true);
  };

  const colmns = [
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
    !handleIsMiniCoupon()
      ? {
          title: '采购价',
          dataIndex: 'minPurchasePrice',
          render: (data: any, records: any) => (
            <span>￥{handlePrice(data, records.maxPurchasePrice)}</span>
          ),
        }
      : {
          title: '零售价',
          dataIndex: 'minSalePrice',
          render: (data: any, records: any) => (
            <span>￥{handlePrice(data, records.maxSalePrice)}</span>
          ),
        },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (_: any, records: any, index: number) => (
        <ButtonList
          isLink
          list={[
            {
              text: '删除',
              onClick: () => {
                handleItemRemove(index);
              },
            },
          ]}
        />
      ),
    },
  ];

  const handleSubmitRemove = () => {
    setShowModal(false);
    const newList = cloneDeep(tempRowProducts);
    const newKeyList = cloneDeep(selectedProductRowKeys);
    newList.splice(selectedIndex.current, 1);
    newKeyList.splice(selectedIndex.current, 1);
    dispatch({
      type: 'coupon/updateState',
      payload: {
        selectRowProducts: newList,
        tempRowProducts: newList,
        selectedProductRowKeys: newKeyList,
      },
    });
  };

  const deleteOpt = {
    title: '提示',
    visible: showModal,
    width: 250,
    onCancel() {
      setShowModal(false);
    },
    onOk() {
      handleSubmitRemove();
    },
  };

  return (
    <div className={Styles.items}>
      <Modal {...deleteOpt}>确认删除改商品？</Modal>
      <div className={Styles.title}>
        <Button type="primary" size="small" onClick={onOpenProductModal}>
          添加商品
        </Button>
      </div>
      <Table
        style={{ margin: '20px' }}
        columns={colmns}
        bordered
        dataSource={selectRowProducts}
        rowKey="id"
        // onChange={pageChange}
        // pagination={{ total: detailTotal, current: detailCurrent }}
        pagination={false}
      />
    </div>
  );
};

export default ProductTable;
