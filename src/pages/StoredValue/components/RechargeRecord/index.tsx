import { convenientDateRangeSchema, GeneralTableLayout } from '@/components/Business/Table';
import { WaterNumber } from '@/pages/Finance/Balance/Merchant/components/DetailListModal/StoredValue';

import type { IStoredValueColumn } from '../../Api';
import { getStoreValueActivitiesDetail } from '../../Api';

export default function RechargeRecord() {
  return (
    <GeneralTableLayout<IStoredValueColumn, any>
      request={getStoreValueActivitiesDetail}
      operationButtonListProps={false}
      searchProps={{
        minItem: 3,
        items: [
          {
            name: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '商品店铺名称/手机号/流水号',
              },
            },
            '[startTime,endTime]': convenientDateRangeSchema({ title: '充值时间' }),
          },
        ],
      }}
      columns={[
        {
          title: '活动名称',
          dataIndex: 'eventName',
          render: (v) => v || '--',
        },
        {
          title: '商家名称',
          dataIndex: 'storeName',
          render: (v) => v || '--',
        },
        {
          title: '注册手机号',
          dataIndex: 'linkPhone',
          render: (v) => v || '--',
        },
        {
          title: '充值金额',
          dataIndex: 'amount',
          render: (v) => v || '--',
        },
        {
          title: '赠送金额',
          dataIndex: 'give',
          render: (v) => v || '--',
        },
        {
          title: '到账金额',
          dataIndex: 'accountAmount',
          render: (v) => v || '--',
        },
        {
          title: '支付方式',
          dataIndex: 'channelCode',
          render: (v) => v || '--',
        },
        {
          title: '交易流水号',
          dataIndex: 'channelTradeNo',
          render: (_, record) => <WaterNumber record={record} />,
        },
        {
          title: '充值时间',
          dataIndex: 'createTime',
          render: (v) => v || '--',
          width: 178,
        },
      ]}
    />
  );
}
