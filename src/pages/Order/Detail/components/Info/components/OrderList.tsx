import { ButtonList } from '@/components/Library/ButtonList';

import { useWatch } from '@/foundations/hooks';

import {
  deliveryMap,
  getOrderStatus,
  ELLIPSIS,
  canShowDeliveryButton,
} from '@/pages/Order/Constants';

import { MathCalcul } from '@/foundations/Support/Math';

import { Icons } from '@/components/Library/Icon';

import { useState, useRef } from 'react';
import * as React from 'react';
import { Table, Card, Typography, Popconfirm, message, Empty, Button, Space } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import classNames from 'classnames';
import { useImmer } from 'use-immer';

import { useUnmount } from 'ahooks';

import { isArr } from '@/utils';

import { cancelDistributionPurchaseOrder } from '@/pages/Order/NextDistributionPurchaseOrder/Api';

import AddDistributionOrder from './AddDistributionOrder';

import { useOrderExpressButtons } from '../../../ButtonList/expressOrRefundButtons';

import styles from '../index.less';

import type { PurchaseOrderColumns } from '../../../../Api';
import {
  addSupplierOrder,
  supplyOrderDetail,
  paySupplyOrder,
  // couponPay,
  getPayResult,
} from '../../../../Api';
import { Container } from '../../../Container';

const { Text } = Typography;

const toFixedTwo = (val?: string) => parseFloat(val || '0').toFixed(2);

const handleGoProduct = (id: any) => window.open(`/product/manager/view/${id}`);
const handleGoDistributionProduct = (id: any) => window.open(`/product/distribution/view/${id}`);
const handleGoSupplyProduct = (id: any) => window.open(`/collection/Product/detail/${id}`);
// 供货商品
const handleGoSupplyView = (id: string) => window.open(`/product/supply/view/${id}`);
// 商家自营商品
const handleMerchantSelfProduct = (id: string) =>
  window.open(`/product/merchantSelfGoods/view/${id}`);

let isSalesOrder = window.location.pathname.includes('/orders/sales');
let isPurchaseOrder = window.location.pathname.includes('/orders/purchase');

export const handleUnitTips = (record: any) => {
  const { attrs } = record.chargeVO;
  const unit = {
    平方米: (
      <div>
        <span>
          {attrs[0]?.attrName}：{attrs[0]?.attrVal}
          {attrs[0]?.attrUnitName}
        </span>
        ，
        <span>
          {attrs[1]?.attrName}：{attrs[1]?.attrVal}
          {attrs[1]?.attrUnitName}
        </span>
      </div>
    ),
    米: (
      <div>
        {attrs[0]?.attrName}：{attrs[0]?.attrVal}
        {attrs[0]?.attrUnitName}
      </div>
    ),
    千克: (
      <div>
        {attrs[0]?.attrName}：{attrs[0]?.attrVal}
        {attrs[0]?.attrUnitName}
      </div>
    ),
  }[record.productChargeUnitName || '米'];
  return unit;
};

const handleGoSupply = (suId: string) => {
  window.open(`/orders/supplier/detail/${suId}`);
};

const handleShowProductView = (records: any) => {
  if (window.location.pathname.includes('/orders/supplier')) {
    return handleGoDistributionProduct(records.productInfoId);
  }
  if (window.location.pathname.includes('/orders/brandSupplier')) {
    return handleGoSupplyProduct(records?.fromProductInfoId);
  }
  if (records.distribution) {
    return handleGoDistributionProduct(records.productInfoId);
  }

  /**
   *  productType  0: 采购商品， 1：小程序商品， 2：供货商品， 3：分销商品， 4：商家自营商品
   */

  if (Number(records?.productType) === 0) {
    return handleGoProduct(records.productInfoId);
  }

  if (Number(records?.productType) === 1) {
    return '';
  }

  if (Number(records?.productType) === 2) {
    return handleGoSupplyView(records.productInfoId);
  }

  if (Number(records?.productType) === 3) {
    return handleGoDistributionProduct(records.productInfoId);
  }

  if (Number(records?.productType) === 4) {
    return handleMerchantSelfProduct(records.productInfoId);
  }

  return handleGoProduct(records.productInfoId);
};

const columns: ColumnProps<PurchaseOrderColumns['productList'][0]>[] = [
  {
    title: '发货状态',
    dataIndex: 'isDelivery',
    align: 'center',
    width: '10%',
    render: (type, records) => {
      return (
        <div>
          <span>{deliveryMap[type]}</span>
          <br />
          {(isPurchaseOrder || isSalesOrder) &&
            records.brandSupplierOrderId !== '-1' &&
            records.brandSupplierOrderId && (
              <span
                style={{ color: '#1890ff', cursor: 'pointer' }}
                onClick={() => {
                  handleGoSupply(records.brandSupplierOrderId);
                }}
              >
                查看关联单
              </span>
            )}
        </div>
      );
    },
  },
  {
    title: '商品名称',
    dataIndex: 'productName',
    align: 'center',
    width: '15%',
    render: (data: any, record: any) => {
      return (
        <span
          onClick={() => handleShowProductView(record)}
          style={{ color: '#1890ff', cursor: 'pointer' }}
        >
          {data}
        </span>
      );
    },
  },
  {
    title: '购买规格',
    dataIndex: 'productPropVal',
    align: 'center',
    width: '30%',
    render: (v, records) => {
      return (
        <div>
          {v || ELLIPSIS}
          {handleUnitTips(records)}
        </div>
      );
    },
  },
  {
    title: '商品单价',
    dataIndex: 'productPrice',
    align: 'center',
    width: '10%',
    render: (data, records: any) => (
      <span>
        ￥{data}/{records.productChargeUnitName}
      </span>
    ),
  },
  {
    title: '数量',
    dataIndex: 'productNum',
    align: 'center',
    width: '5%',
  },
  {
    title: '小计',
    dataIndex: 'productTotalMoney',
    align: 'center',
    width: '10%',
    render: (data, records) => (
      <span>
        ￥{toFixedTwo(data)}
        {records.productMoney && records.productMoney !== data && (
          <>
            （<Text delete>￥{toFixedTwo(records.productMoney)}</Text>）
          </>
        )}
      </span>
    ),
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    width: '20%',
  },
];

const getDeliveryDataSource = (dataSources: any) =>
  Object.keys(dataSources).reduce(
    (previous, orderId) => previous.concat(dataSources[orderId]),
    [] as any[],
  );

// 组件
const Main = ({
  dataSource,
}: {
  dataSource: PurchaseOrderColumns;
  handleGetDetail: () => void;
}) => {
  const { state: storeState } = Container.useContainer();
  const [state, setState] = useImmer({
    dataSources: {} as Record<string, any[]>,
    selectedRowKeys: {} as Record<string, any[]>,
  });
  const [isShowSupply, setShowSupply] = useState(false);
  const [supplyDetail, setSupplyDetail] = useState({} as any);
  const [payQRcodeUrl, setPayQRcodeUrl] = useState('');
  const stopSetIntervalRef = useRef<number>(null);
  isSalesOrder = window.location.pathname.includes('/orders/sales');
  isPurchaseOrder = window.location.pathname.includes('/orders/purchase');

  const handleStopSetInterval = React.useCallback(() => {
    if (stopSetIntervalRef.current) {
      clearInterval(stopSetIntervalRef.current);
    }
  }, []);

  useWatch(() => {
    if (isShowSupply) {
      if (supplyDetail?.id) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        getOrderPayStatus(supplyDetail?.id);
      }
    } else {
      handleStopSetInterval();
    }
  }, [isShowSupply]);

  useUnmount(() => {
    handleStopSetInterval();
  });

  useWatch(() => {
    if (['delivery', 'reimburse'].some((k) => storeState.submitSuccess.indexOf(k) === 0)) {
      setState((draft) => {
        draft.dataSources = {};
        draft.selectedRowKeys = {};
      });
    }
  }, [storeState.submitSuccess]);

  const getOrderPayStatus = (supplyDetailId: any) => {
    stopSetIntervalRef.current = setInterval(() => {
      getPayResult(supplyDetailId).then((res) => {
        if (res.data?.trade_status === 'TRADE_SUCCESS' || res.data?.trade_state === 'SUCCESS') {
          setShowSupply(false);
          // handleGetDetail()

          message.success('支付成功了！');

          handleStopSetInterval();
          window.location.reload();
        }
      });
    }, 5000);
  };

  const handleGetPayQrCode = (type: string, supplyDetailId: string, totalMoney: any) => {
    const requestParam = {
      channelTrxType: 'QR',
      merchantOrderNum: supplyDetailId,
      paymentSubject: '供货单支付',
      paymentAmount: totalMoney,
      tradeType: 'BrandSupplierOrder',
    };

    paySupplyOrder({ channelCode: type, ...requestParam }).then((res) => {
      setPayQRcodeUrl(res.data);
    });
  };

  const handleAddDistribution = () => {
    const selectOrders = Object.values(state.selectedRowKeys).filter(
      (item) => JSON.stringify(item) !== '[]',
    );

    if (selectOrders.length < 1) return message.warning('请先勾选需要下分销采购单的商品');

    if (selectOrders.length > 1) return message.warning('只能选择一个供货商订单下分销采购单');

    const selectProduct = Object.values(state.dataSources).filter(
      (item) => JSON.stringify(item) !== '[]',
    );

    if (!selectProduct[0][0]?.distribution) return message.warning('非分销商品，请直接发货');

    const {
      customerName,
      customerPhone,
      province,
      provinceId,
      city,
      cityId,
      area,
      areaId,
      street,
      streetId,
      address,
      sn,
      remark,
    } = dataSource;
    const reProducts: any = [];
    selectProduct.forEach((items) => {
      items.forEach((item) => {
        reProducts.push(item);
      });
    });

    const products = reProducts?.map((item: any) => ({
      productId: item.productId,
      purchaseOrderProductId: item.id,
      productNum: item.productNum,
      attrs: item?.chargeVO?.attrs || [],
      remark: item.remark,
    }));

    const params = {
      customerName,
      customerPhone,
      province,
      provinceId,
      city,
      cityId,
      area,
      areaId,
      street,
      streetId,
      address,
      remark,
      purchaseOrderSn: sn,
      productList: products,
    };

    return addSupplierOrder(params).then((addRes) => {
      supplyOrderDetail(addRes.data).then((res) => {
        handleGetPayQrCode('wechat', res.data?.id, res.data?.totalMoney);
        setSupplyDetail(res.data);
        setShowSupply(true);
      });
    });
  };

  const orders = dataSource.isParentOrder
    ? dataSource.childList || []
    : isSalesOrder
    ? dataSource.childListOrder || []
    : [dataSource];

  const renderSalesOrderTitle = (item: any) => (
    <div
      className={styles.productInformationTitleOrderInfo}
      style={{ justifyContent: 'flex-start' }}
    >
      <Space>
        <Button style={{ marginRight: '10px' }} type="danger" size="small">
          分销
        </Button>
        <span>供货商商家：</span>
        {item.supplierInfo.supplierName}
        {item.supplierInfo.supplierPhone}
      </Space>
    </div>
  );

  const renderOrderTitle = (item: PurchaseOrderColumns) => {
    const deductionAmount = new MathCalcul(item.originalMoney).minus(item.totalMoney).toFixed();

    return (
      <div className={styles.productInformationTitleOrderInfo}>
        <div>
          {item.distribution && (
            <Button style={{ marginRight: '10px' }} type="danger" size="small">
              分销
            </Button>
          )}
          <span>子订单编号：</span>
          {item.sn}（{getOrderStatus(item.orderStatus)}）
        </div>
        <div>
          供{item.distribution ? '货' : '应'}商商家：
          {item.distribution
            ? !item.supplierName
              ? ''
              : `${item.supplierName}（${item.supplierPhone}）`
            : item.supplier?.supplierName}
        </div>
        <div>
          子订单合计：￥{toFixedTwo(item.totalMoney)}
          <Popconfirm
            overlayClassName={styles.productInfoPopconfirm}
            title={`
              商品合计 ￥${toFixedTwo(item.totalMoney)}
              ${deductionAmount !== '0' ? `(已减 ￥${deductionAmount})` : ''}
            `}
            okText="确认"
            trigger="hover"
          >
            <Icons type="QuestionCircleOutlined" style={{ marginLeft: 10, cursor: 'pointer' }} />
          </Popconfirm>
        </div>
      </div>
    );
  };

  const canDeliveryOrReimburse =
    orders.length && dataSource.payWay > -1 && canShowDeliveryButton(dataSource.orderStatus);

  const renderOrders = () =>
    orders.map((item: any, index: any) => {
      const title = !dataSource.isParentOrder ? undefined : () => renderOrderTitle(item);
      const currentSelectedRowKeys = state.selectedRowKeys[item.id];

      const rowSelection = !canDeliveryOrReimburse
        ? undefined
        : {
            selectedRowKeys: isArr(currentSelectedRowKeys) ? currentSelectedRowKeys : [],
            onChange: (selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
              setState((draft) => {
                draft.dataSources[item.id] = selectedRows.filter(Boolean);
                draft.selectedRowKeys[item.id] = selectedRowKeys;
              });
            },
            getCheckboxProps: (record: PurchaseOrderColumns['productList'][0]) => ({
              disabled: record.distribution
                ? (record.brandSupplierOrderId && record.brandSupplierOrderId !== '-1') ||
                  !!Number(record.isDelivery)
                : !!Number(record.isDelivery),
              name: record.productName,
            }),
          };

      return (
        <Table<PurchaseOrderColumns['productList'][0]>
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          rowKey="id"
          bordered
          {...{
            columns,
            title,
            rowSelection,
            pagination: false,
            dataSource: item.productList,
            className: classNames(styles.productInformationTable, {
              [styles.productInformationNotParentOrderTable]: !dataSource.isParentOrder,
            }),
          }}
        />
      );
    });

  const renderSalesOrders = () =>
    orders.map((item: any, index: any) => {
      const title = !item.supplierInfo.isDistributionOrder
        ? undefined
        : () => renderSalesOrderTitle(item);
      const currentSelectedRowKeys = state.selectedRowKeys[item.id];
      const rowSelection = !canDeliveryOrReimburse
        ? undefined
        : {
            selectedRowKeys: isArr(currentSelectedRowKeys) ? currentSelectedRowKeys : [],
            onChange: (selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
              setState((draft) => {
                draft.dataSources[item.id] = selectedRows.filter(Boolean);
                draft.selectedRowKeys[item.id] = selectedRowKeys;
              });
            },
            getCheckboxProps: (record: PurchaseOrderColumns['productList'][0]) => ({
              disabled: record.distribution
                ? (record.brandSupplierOrderId && record.brandSupplierOrderId !== '-1') ||
                  !!Number(record.isDelivery)
                : !!Number(record.isDelivery),
              name: record.productName,
            }),
          };
      if (!item.distributionProduct.length) {
        return <></>;
      }
      return (
        <Table<PurchaseOrderColumns['productList'][0]>
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          rowKey="id"
          bordered
          {...{
            columns,
            title,
            rowSelection,
            pagination: false,
            dataSource: item.distributionProduct,
            className: classNames(styles.productInformationTable),
          }}
        />
      );
    });

  const supplyOpt = {
    title: '分销采购单',
    width: 1000,
    visible: isShowSupply,
    supplyDetail,
    payUrl: payQRcodeUrl,
    footer: false,
    ELLIPSIS,
    handleUnitTips,
    onCancel() {
      setShowSupply(false);

      supplyDetail?.id && cancelDistributionPurchaseOrder(supplyDetail?.id);
    },
    onPayOrder(e: any) {
      if (e.target.value === 2) {
        handleGetPayQrCode('wechat', supplyDetail?.id, supplyDetail?.totalMoney);
      }
      if (e.target.value === 3) {
        handleGetPayQrCode('alipay', supplyDetail?.id, supplyDetail?.totalMoney);
      }
    },
  };

  const { expressOrRefundButtons }: any = useOrderExpressButtons({
    dataSources: state.dataSources,
    addDistributions: handleAddDistribution,
    handleDeliveryDataSource: getDeliveryDataSource,
  });

  return (
    <Card
      type="inner"
      className={classNames(styles.productInformation, styles.basicTable)}
      title={
        <div className={styles.productInformationTitleBox}>
          <div className={styles.productInformationTitleHeader}>
            <span style={{ marginRight: 24 }}>订单商品</span>
            <span style={{ flex: '1' }}>
              {canDeliveryOrReimburse && (
                <ButtonList size="small" list={expressOrRefundButtons as any} />
              )}
            </span>
            {isSalesOrder && (
              <span>
                所属商家：{dataSource?.store?.storeName}&nbsp;&nbsp;{dataSource?.store?.linkPhone}
              </span>
            )}
          </div>
        </div>
      }
    >
      <AddDistributionOrder {...supplyOpt} />
      {!orders.length ? (
        <Empty description="暂无订单商品信息" />
      ) : isSalesOrder ? (
        renderSalesOrders()
      ) : (
        renderOrders()
      )}
    </Card>
  );
};

export const OrderList = React.memo(Main);
