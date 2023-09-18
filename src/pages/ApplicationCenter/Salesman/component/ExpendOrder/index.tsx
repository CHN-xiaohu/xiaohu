import {
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
  GeneralTableLayout,
} from '@/components/Business/Table';

import type { SalesmanColumns } from '../../Api';
import { getExtendOrders } from '../../Api';
import { getOrderStatus, getOrderInOrOut, getOrderInOrOutStyle } from '../../Constants';

export default function ExpendOrder() {
  return (
    <GeneralTableLayout<SalesmanColumns>
      request={getExtendOrders as any}
      operationButtonListProps={false}
      searchProps={{
        minItem: 3,
        items: [
          {
            purchaseOrderSn: {
              title: '订单编号',
              type: 'string',
              'x-component-props': {
                placeholder: '订单编号',
              },
            },
            '[startTime,endTime]': convenientDateRangeSchema({ title: '下单时间' }),
          },
          {
            recordedAmountOfStatus: {
              title: '入账状态',
              type: 'checkableTags',
              default: '',
              'x-component-props': {
                options: generateDefaultSelectOptions(
                  [
                    { label: '入账中', value: 1 },
                    { label: '已入账', value: 2 },
                    { label: '已失效', value: 3 },
                  ],
                  '',
                ),
              },
            },
          },
        ],
      }}
      columns={[
        {
          title: '订单编号',
          dataIndex: 'purchaseOrderSn',
          width: '10%',
        },
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          width: '6%',
          render: (data) => <span>{getOrderStatus(data)}</span>,
        },
        {
          title: '实付金额',
          dataIndex: 'totalMoney',
          width: '6%',
          render: (data) => <span>￥{data}</span>,
        },
        {
          title: '订单佣金',
          dataIndex: 'extendPrice',
          width: '6%',
          render: (data) => <span>￥{data}</span>,
        },
        {
          title: '入账状态',
          dataIndex: 'recordedAmountOfStatus',
          width: '6%',
          render: (data) => {
            return (
              <span style={{ color: `${getOrderInOrOutStyle(data)}` }}>
                {getOrderInOrOut(data)}
              </span>
            );
          },
        },
        {
          title: '下单商家',
          width: '15%',
          dataIndex: 'storeName',
        },
        {
          title: '佣金信息',
          dataIndex: 'commissionDetail',
          width: '32%',
          render: (data: any, records: any) => {
            return (
              <>
                {records?.extendInfosList.map((items: any) => {
                  return (
                    <div>
                      {items.extendTypeName}
                      {Number(items.extendRate) * 100}% ：{items.salesmanStoreName}
                      （￥{Number(items.extendPrice)}）
                    </div>
                  );
                })}
              </>
            );
          },
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          width: '19%',
          render: (data: any, records: any) => {
            return (
              <div>
                <div>下单时间：{data}</div>
                {records.incomeTime && <div>入账时间：{records.incomeTime}</div>}
              </div>
            );
          },
        },
      ]}
    />
  );
}
