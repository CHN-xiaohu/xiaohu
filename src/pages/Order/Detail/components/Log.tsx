import { memo, useState, useEffect } from 'react';

import { Table } from 'antd';

import type { LogColumn, PurchaseOrderColumns } from '../../Api';
import {
  getOrderLogByOrderId,
  getSalesOrderLog,
  getSupplierOrderLog,
  getBrandSupplierOrderLog,
} from '../../Api';
import { orderLogTypeMap, orderTypeMap, salesOrderTypeMap, Otype } from '../../Constants';

export const Main = ({ dataSource: orderDataSource }: { dataSource: PurchaseOrderColumns }) => {
  const isSalesOrder = window.location.pathname.includes('/orders/sales/');
  const isSupplierOrder = window.location.pathname.includes('/orders/supplier');
  const isBrandSupplierOrder = window.location.pathname.includes('/orders/brandSupplier');
  const [dataSource, setDataSource] = useState<LogColumn[]>([]);

  useEffect(() => {
    let requestUrl = getOrderLogByOrderId;
    if (isSupplierOrder) {
      requestUrl = getSupplierOrderLog;
    } else if (isBrandSupplierOrder) {
      requestUrl = getBrandSupplierOrderLog;
    } else if (isSalesOrder) {
      requestUrl = getSalesOrderLog;
    }

    // const requestUrl = isSupplierOrder || isBrandSupplierOrder ? getSupplierOrderLog :
    // (isSalesOrder ? getSalesOrderLog : getOrderLogByOrderId)

    requestUrl(orderDataSource.id).then((res) => setDataSource(res.data));
  }, [orderDataSource]);

  const handleOrderNum = (records: any) => {
    if (isSalesOrder) {
      return records.salsesOrderId;
    }
    if (isSupplierOrder || isBrandSupplierOrder) {
      return records.brandSupplierOrderId;
    }

    return records.purchaseOrderId;
  };

  return (
    <Table
      rowKey="id"
      bordered
      dataSource={dataSource}
      pagination={false}
      columns={[
        {
          title: '日志号',
          dataIndex: 'purchaseOrderId',
          render: (data: any, records: any) => handleOrderNum(records),
        },
        {
          title: '日志类型',
          dataIndex: 'logType',
          render: (type: number, records: any) => {
            return orderLogTypeMap[type]?.replace('采购单', Otype[records?.type]);
          },
        },
        {
          title: '日志内容',
          dataIndex: 'content',
        },
        {
          title: '订单类型',
          dataIndex: 'orderType',
          render: (type: number, records: any) =>
            !isSalesOrder
              ? orderTypeMap[type]?.replace('采购单', Otype[records?.type])
              : salesOrderTypeMap[type],
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
          width: 178,
        },
      ]}
    />
  );
};

export const OrderLog = memo(Main);
