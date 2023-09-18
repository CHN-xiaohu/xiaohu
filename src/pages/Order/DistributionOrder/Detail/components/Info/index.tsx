import { getOrderStatus, getOrderStatusColor, payWayMap, ELLIPSIS } from '@/pages/Order/Constants';
import { convertNumberToChinese } from '@/utils';
import { MathCalcul } from '@/foundations/Support/Math';
import { WaterNumber } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/StoredValue';
import { MoneyText } from '@/components/Library/MoneyText';
import { getCouponDescriptionByType } from '@/pages/Coupon/Util';

import { Table, Card, Badge } from 'antd';
import { memo, useMemo } from 'react';

import { CustomerInfo } from './components/CustomerInfo';
import { OrderList } from './components/OrderList';
import { DeliveryList } from './components/DeliveryList';

import styles from './index.less';

import type { PurchaseOrderColumns } from '../../../../Api';

const toFixed = (value: string) => parseFloat(value || '0').toFixed(2);

export const Main = ({
  dataSource,
  handleGetDetail,
}: {
  dataSource: PurchaseOrderColumns;
  handleGetDetail: () => void;
}) => {
  const [totalMoney, cnTotalMoney] = useMemo(() => {
    const totalMoneyToFixed = toFixed(dataSource.totalMoney);

    return [totalMoneyToFixed, convertNumberToChinese(totalMoneyToFixed)];
  }, [dataSource.totalMoney]);

  const orderCount = useMemo(
    () =>
      !dataSource.childList?.length
        ? dataSource.originalMoney
        : dataSource.childList
            .reduce((mathCalcul, child) => mathCalcul.plus(child.originalMoney), new MathCalcul(0))
            .toFixed(2),
    [dataSource.childList, dataSource.originalMoney],
  );

  const handleGetPayStatus = () => {
    return (
      dataSource &&
      dataSource.productList &&
      dataSource.productList[0] &&
      dataSource.productList[0].isDelivery
    );
  };

  const coupon = dataSource.orderBill?.couponRecordVO?.coupon || dataSource.couponVO;

  return (
    <>
      <Card className={styles.basicInformation}>
        <div className={styles.sn}>
          <div>
            订单编号：{dataSource.sn}
            <Badge
              style={{ marginLeft: '3%' }}
              status={getOrderStatusColor(dataSource.orderStatus)}
              text={getOrderStatus(dataSource.orderStatus)}
            />
          </div>
          <span>{dataSource.createTime}</span>
        </div>

        <div className={styles.moneyBox}>
          <div className={styles.moneyBoxItem}>
            订单金额：
            <span className={styles.money}>
              ￥{totalMoney} （人民币{cnTotalMoney}）
            </span>
          </div>
        </div>
        <div style={{ marginTop: '15px' }} className={styles.distributions}>
          分销商：{dataSource.tenantName}（{dataSource.contactNumber}）
        </div>
        <div
          className={styles.distributions}
          style={{ marginTop: `${handleGetPayStatus() !== 2 ? '15px' : ''}` }}
        >
          供货商：{dataSource?.brandInfo?.tenantName}（{dataSource?.brandInfo?.contactNumber}）
        </div>
      </Card>

      <CustomerInfo />

      <OrderList dataSource={dataSource} handleGetDetail={handleGetDetail} />

      <DeliveryList />

      {dataSource?.remark && (
        <Card type="inner" title="订单备注" className={styles.defaultCard}>
          <div>下单备注：{dataSource?.remark}</div>
        </Card>
      )}

      <Table
        bordered
        title={() => <b>收款清单</b>}
        className={styles.headerTable}
        pagination={false}
        dataSource={[
          {
            orderCount,
            coupon: Object.keys(coupon || {}).length
              ? getCouponDescriptionByType(coupon)
              : ELLIPSIS,
            totalMoney: dataSource.orderBill?.createTime ? dataSource.totalMoney : undefined,
            payWay: payWayMap[dataSource.payWay] || ELLIPSIS,
            tradingWater: {
              paymentOrderNum: dataSource.orderBill?.paymentOrderNum,
              channelTradeNo: dataSource.orderBill?.channelTradeNo,
            },
            payTime: dataSource.orderBill?.createTime || ELLIPSIS,
          },
        ]}
        rowKey={(_, idx) => idx?.toString() || ''}
        columns={[
          {
            title: '订单合计',
            dataIndex: 'orderCount',
            render: (v) => <MoneyText>{v}</MoneyText>,
          },
          {
            title: '使用优惠',
            dataIndex: 'coupon',
          },
          {
            title: '实收金额',
            dataIndex: 'totalMoney',
            render: (v) => (v ? <MoneyText>{v}</MoneyText> : ELLIPSIS),
          },
          {
            title: '支付方式',
            dataIndex: 'payWay',
          },
          {
            title: '交易流水号',
            dataIndex: 'tradingWater',
            render: (v) => <WaterNumber record={v} />,
          },
          {
            title: '收款时间',
            dataIndex: 'payTime',
          },
        ]}
      />
    </>
  );
};

export const OrderInfo = memo(Main);
