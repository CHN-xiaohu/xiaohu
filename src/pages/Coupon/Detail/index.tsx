import { useStoreState } from '@/foundations/Model/Hooks/Model';

import { Image } from '@/components/Business/Table/Image';

import { useState, useEffect } from 'react';
import { Card, Spin, Table, Input } from 'antd';
import { useDispatch } from 'dva';

import { handleSubstringTextAfter } from '@/utils';

import type { DetailColumns } from '../Api';
import { couponDetail, getMiniCouponDetail } from '../Api';
import { getDiscountText, getUsed, publishType, handlePrice, handleIsMiniCoupon } from '../Util';

import Styles from '../style.less';

const { TextArea } = Input;

const CouponDetail = ({
  match: {
    params: { id },
  },
}: any) => {
  const dispatch = useDispatch();

  const [detail, setDetailValue] = useState({} as DetailColumns);
  const [isLoading, setLoading] = useState(true);

  const { tempRowProducts, detailTotal, detailCurrent, categoryName } = useStoreState('coupon');

  const initRequest = () => {
    setLoading(true);
    const requestUrl = window.location.pathname.split('/').includes('miniProgram')
      ? getMiniCouponDetail
      : couponDetail;
    requestUrl(id).then((res) => {
      const { data } = res;
      setDetailValue(data);
      if (data.used === 20 || data.used === 40) {
        dispatch({
          type: 'coupon/getCouponProducts',
          payload: {
            size: 10,
            current: 1,
            couponId: id,
          },
        });
      } else if (data.used === 30) {
        dispatch({
          type: 'coupon/getPerCategoryName',
          payload: {
            id: data.categoryId,
          },
        });
      }
      setTimeout(() => {
        setLoading(false);
      }, 0);
    });
  };

  useEffect(() => {
    if (id) {
      initRequest();
    }
  }, [id]);

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
      render: (data: any, records: any) => <span>￥{handlePrice(data, records.maxSalePrice)}</span>,
    },
  ];

  const pageChange = (page: any) => {
    dispatch({
      type: 'coupon/getCouponProducts',
      payload: {
        current: page.current,
        size: page.pageSize,
        couponId: id,
      },
    });
  };

  return (
    <Card>
      <Spin spinning={isLoading}>
        优惠券详情
        <ul className={Styles.detail}>
          <li>优惠券名称: {detail.name}</li>
          <li>
            优惠类型:{' '}
            {getDiscountText(
              detail.withAmount,
              detail.type,
              detail.usedAmount,
              detail.usedDiscount,
            )}
          </li>
          <li>发放总数: {detail.quota}</li>
          <li>
            领券时间: {detail.takeStartTime}~{detail.takeEndTime}
          </li>
          <li>每人限领次数: {detail.takeLimit}次</li>
          <li>
            用券时间:{' '}
            {detail.validType === 1 ? (
              <span>
                {detail.validStartTime} ~ {detail.validEndTime}
              </span>
            ) : (
              <span>领取后{detail.validDays}天有效</span>
            )}
          </li>
          <li>推广方式：{publishType[detail.publishType]}</li>
          <li>适用商品：{handleSubstringTextAfter(`${getUsed(detail.used)}`, '：')}</li>
          <li style={{ display: 'flex' }}>
            使用说明：
            <TextArea disabled style={{ width: 400 }} value={detail.remark || '无'} />
          </li>
          <li>
            {detail.used === 20 && (
              <Table
                style={{ paddingRight: '20px' }}
                columns={colmns}
                bordered
                dataSource={tempRowProducts}
                rowKey="id"
                onChange={pageChange}
                pagination={{ total: detailTotal, current: detailCurrent }}
              />
            )}
            {detail.used === 30 && <span>类目名称：{categoryName}</span>}
          </li>
        </ul>
      </Spin>
    </Card>
  );
};

export default CouponDetail;
