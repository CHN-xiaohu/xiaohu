import { Table, Card, Badge, Button } from 'antd';

import { memo, useMemo } from 'react';

import { nanoid } from 'nanoid';

import { CustomerInfo } from './components/CustomerInfo';

import { OrderList } from './components/OrderList';

import { DeliveryList } from './components/DeliveryList';

import styles from './index.less';

import { getOrderStatus, getOrderStatusColor, payWayMap, ELLIPSIS } from '@/pages/Order/Constants';
import { convertNumberToChinese } from '@/utils';
import { MathCalcul } from '@/foundations/Support/Math';
import { WaterNumber } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/StoredValue';
import { MoneyText } from '@/components/Library/MoneyText';
import { getCouponDescriptionByType } from '@/pages/Coupon/Util';

import type { PurchaseOrderColumns } from '../../../Api';

const toFixed = (value: string) => parseFloat(value || '0').toFixed(2);

export const Main = ({
  dataSource,
  handleGetDetail,
}: {
  dataSource: PurchaseOrderColumns;
  handleGetDetail: () => void;
}) => {
  const isPurchaseOrder = window.location.pathname.includes('/orders/purchase/');
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');

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

  const hendleGetfreePrice = () => {
    const groupPrice =
      dataSource?.purchaseActivityVO?.bizGroupPurchaseConditions
        .map((item: any) => item.price)
        .sort((a: any, b: any) => a - b)[0] || dataSource?.purchaseActivityVO?.price;

    let num = 1;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    dataSource.productList &&
      dataSource.productList.forEach((item: any) => {
        num = Number(item.productNum);
      });
    return (Number(totalMoney) - num * Number(groupPrice)).toFixed(2);
  };

  const handleIsShowRemark = () => {
    if (!isSalesOrder) {
      if (isSupplierOrder && !dataSource.remark) return false;
      if (isBrandSupplierOrder && !dataSource.remark) return false;
      return true;
    }

    return false;
  };

  const coupon = dataSource.orderBill?.couponRecordVO?.coupon || dataSource.couponVO;

  return (
    <>
      <Card className={styles.basicInformation}>
        <div className={styles.sn}>
          <div>
            {dataSource.distribution && (
              <Button className={styles.supplyPad} type="danger" size="small">
                分销
              </Button>
            )}
            订单编号：{dataSource.sn}
            <Badge
              style={{ marginLeft: '3%' }}
              status={getOrderStatusColor(dataSource.orderStatus)}
              text={getOrderStatus(dataSource.orderStatus)}
            />
          </div>
          {isSupplierOrder && !!dataSource.purchaseOrderSn && (
            <div className={styles.supplierNo}>买家订单编号：{dataSource.purchaseOrderSn}</div>
          )}
          <span>{dataSource.createTime}</span>
        </div>

        <div className={styles.moneyBox}>
          <div className={styles.moneyBoxItem}>
            订单金额：
            <span className={styles.money}>
              ￥{totalMoney} （人民币{cnTotalMoney}）
            </span>
          </div>
          {isSupplierOrder && !!dataSource.tenantName && (
            <div className={styles.supplier}>供货商：{dataSource.tenantName}</div>
          )}
        </div>
        <div className={styles.grouopBuy}>
          {dataSource.orderStatus === 3 && dataSource?.purchaseActivityVO?.showStatus === 1 && (
            <div className={styles.isPass}>
              <Button danger size="small">
                团购
              </Button>
              团购活动进行中，团购结束后，统一进行发货
            </div>
          )}
          {handleGetPayStatus() !== 2 && dataSource?.purchaseActivityVO?.showStatus === 2 && (
            <div>
              <Button danger size="small">
                团购
              </Button>
              团购活动已结束，团购价：
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                ￥{Number(dataSource?.purchaseActivityVO?.price).toFixed(2)}
              </span>
              ， 返现
              <span style={{ color: 'red', fontWeight: 'bold' }}>￥{hendleGetfreePrice()}</span>
            </div>
          )}
        </div>
        {/* {
          (isPurchaseOrder && dataSource?.orderBill) && (
            <div>
              <div className={styles.payType}>
                支付方式：{payWayMap[Number(dataSource?.orderBill?.payWay)]}支付
              </div>
              <div>
                支付时间：{dataSource?.orderBill?.createTime}
              </div>
            </div>
          )
        } */}
        {isBrandSupplierOrder && (
          <div className={styles.distributions}>
            分销商：{dataSource.tenantName}（{dataSource.contactNumber}）
          </div>
        )}
        {isPurchaseOrder && dataSource.distribution && dataSource?.supplierName && (
          <div
            className={styles.distributions}
            style={{ marginTop: `${handleGetPayStatus() !== 2 ? '15px' : ''}` }}
          >
            供货商：{dataSource.supplierName}（{dataSource.supplierPhone}）
          </div>
        )}
      </Card>

      <CustomerInfo />

      <OrderList dataSource={dataSource} handleGetDetail={handleGetDetail} />

      <DeliveryList />
      {handleIsShowRemark() && (
        <Card type="inner" title="订单备注" className={styles.defaultCard}>
          {!isBrandSupplierOrder && !isSupplierOrder && (
            <div style={{ marginBottom: 15 }}>下单商家： {dataSource.store?.storeName}</div>
          )}
          <div>下单备注：{dataSource.remark}</div>
        </Card>
      )}

      <Table
        bordered
        title={() => <b>收款清单</b>}
        className={styles.headerTable}
        pagination={false}
        dataSource={[
          {
            __uniqueId: nanoid(),
            orderCount,
            coupon: Object.keys(coupon || {}).length
              ? getCouponDescriptionByType(coupon)
              : ELLIPSIS,
            totalMoney: dataSource.orderBill?.createTime ? dataSource.totalMoney : undefined,
            payWay: payWayMap[dataSource.payWay] || ELLIPSIS,
            payTime: dataSource.orderBill?.createTime || ELLIPSIS,
            tradingWater: {
              paymentOrderNum: dataSource.orderBill?.paymentOrderNum,
              channelTradeNo: dataSource.orderBill?.channelTradeNo,
            },
          },
        ]}
        rowKey="__uniqueId"
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
