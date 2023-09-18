import { memo, useState, useEffect } from 'react';

import { Table } from 'antd';

import type { LogColumn, PurchaseOrderColumns } from '../../../Api';
import { getBrandSupplierOrderLog } from '../../../Api';
import { orderLogTypeMap, orderTypeMap, Otype } from '../../../Constants';

export const Main = ({ dataSource: orderDataSource }: { dataSource: PurchaseOrderColumns }) => {
  const [dataSource, setDataSource] = useState<LogColumn[]>([]);

  useEffect(() => {
    getBrandSupplierOrderLog(orderDataSource.id).then((res) => setDataSource(res.data));
  }, [orderDataSource]);

  const handleOrderNum = (records: any) => records.brandSupplierOrderId;

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
            orderTypeMap[type]?.replace('采购单', Otype[records?.type]),
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
