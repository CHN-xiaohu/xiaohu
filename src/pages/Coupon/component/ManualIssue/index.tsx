import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { ButtonList } from '@/components/Library/ButtonList';

import { useState } from 'react';
import { Modal, Table, InputNumber, Button } from 'antd';
import { cloneDeep } from 'lodash';

import { useDispatch } from 'dva';

import MerchantList from './MerchantList';

import { handleIsMiniCoupon } from '../../Util';

import Styles from '../../style.less';

const ManualIssue = ({ couponId, onChangeCount, ...manualOpt }: any) => {
  const { merchantList, currentMerchantList, selectedProductRowKeys } = useStoreState('coupon');

  const dispatch = useDispatch();

  const [isChooseMerchant, setChooseMerchant] = useState(false);

  const handltCancelMerchant = (index: number) => {
    const newList = cloneDeep(merchantList);
    const newKeyList = cloneDeep(selectedProductRowKeys);
    newList.splice(index, 1);
    newKeyList.splice(index, 1);
    dispatch({
      type: 'coupon/updateState',
      payload: {
        merchantList: newList,
        selectedProductRowKeys: newKeyList,
        currentMerchantList: newList,
      },
    });
  };

  const chooseColumns = [
    handleIsMiniCoupon()
      ? {
          title: '用户昵称',
          dataIndex: 'nickname',
        }
      : {
          title: '商家名称',
          dataIndex: 'storeName',
        },
    handleIsMiniCoupon()
      ? {
          title: '用户手机号',
          dataIndex: 'phone',
        }
      : {
          title: '商家手机',
          dataIndex: 'linkPhone',
        },
    {
      title: '操作',
      dataIndex: 'id',
      render: (_: any, records: any, index: number) => (
        <ButtonList isLink list={[{ text: '取消', onClick: () => handltCancelMerchant(index) }]} />
      ),
    },
  ];

  const handleGetMerchant = () => {
    setChooseMerchant(true);
    const productsKey = currentMerchantList.map((i) => i?.id);
    dispatch({
      type: 'coupon/updateState',
      payload: {
        selectedProductRowKeys: productsKey,
      },
    });
  };

  const merchantOpt = {
    title: handleIsMiniCoupon() ? '选择用户' : '选择商家',
    visible: isChooseMerchant,
    width: 900,
    merchantList,
    onCancel() {
      setChooseMerchant(false);
    },
    onOk() {
      const productsKey = merchantList.map((i) => i?.id);
      dispatch({
        type: 'coupon/updateState',
        payload: {
          currentMerchantList: merchantList,
          selectedProductRowKeys: productsKey,
        },
      });
      setChooseMerchant(false);
    },
  };

  return (
    <Modal {...manualOpt}>
      {isChooseMerchant && <MerchantList {...merchantOpt} />}
      <div className={Styles.mannal}>
        <span className={Styles.requerdIcon}>*</span>
        <div className={Styles.titles}>发放张数：</div>
        <InputNumber
          onChange={onChangeCount}
          className={Styles.input}
          placeholder="请输入每个商家发放张数（1-100）"
          precision={0}
        />
      </div>
      <div className={Styles.mannal}>
        <span className={Styles.requerdIcon}>*</span>
        <div className={Styles.titles}>发放{handleIsMiniCoupon() ? '用户' : '商家'}：</div>
        <Button type="primary" onClick={handleGetMerchant}>
          添加{handleIsMiniCoupon() ? '用户' : '商家'}
        </Button>
      </div>
      <Table columns={chooseColumns} bordered dataSource={currentMerchantList} rowKey="id" />
    </Modal>
  );
};

export default ManualIssue;
