import { deliveryMap, getOrderStatus, ELLIPSIS } from '@/pages/Order/Constants';

import { MathCalcul } from '@/foundations/Support/Math';

import { Icons } from '@/components/Library/Icon';

import * as React from 'react';
import { Table, Card, Typography, Popconfirm, Empty, Button } from 'antd';
import type { ColumnProps } from 'antd/lib/table';
import classNames from 'classnames';

import styles from '../index.less';

import type { PurchaseOrderColumns } from '../../../../../Api';

const { Text } = Typography;

const toFixedTwo = (val?: string) => parseFloat(val || '0').toFixed(2);

const handleGoSupplyProduct = (id: any) => window.open(`/collection/Product/detail/${id}`);

const isSalesOrder = window.location.pathname.includes('/orders/sales');

const handleUnitTips = (record: any) => {
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

const handleShowProductView = (records: any) => handleGoSupplyProduct(records?.fromProductInfoId);

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
          {window.location.pathname.includes('/orders/purchase') &&
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

const Main = ({
  dataSource,
}: {
  dataSource: PurchaseOrderColumns;
  handleGetDetail: () => void;
}) => {
  const orders = dataSource.isParentOrder ? dataSource.childList || [] : [dataSource];

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

  const renderOrders = () =>
    orders.map((item, index) => {
      const title = !dataSource.isParentOrder ? undefined : () => renderOrderTitle(item);

      return (
        <Table<PurchaseOrderColumns['productList'][0]>
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          rowKey="id"
          bordered
          {...{
            columns,
            title,
            pagination: false,
            dataSource: item.productList,
            className: classNames(styles.productInformationTable, {
              [styles.productInformationNotParentOrderTable]: !dataSource.isParentOrder,
            }),
          }}
        />
      );
    });

  return (
    <Card
      type="inner"
      className={classNames(styles.productInformation, styles.basicTable)}
      title={
        <div className={styles.productInformationTitleBox}>
          <div className={styles.productInformationTitleHeader}>
            <span style={{ marginRight: 24 }}>订单商品</span>
            {isSalesOrder && (
              <span>
                所属商家：{dataSource?.store?.storeName}&nbsp;&nbsp;{dataSource?.store?.linkPhone}
              </span>
            )}
          </div>
        </div>
      }
    >
      {!orders.length ? <Empty description="暂无订单商品信息" /> : renderOrders()}
    </Card>
  );
};

export const OrderList = React.memo(Main);
