import {
  GeneralTableLayout,
  convenientDateRangeSchema,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';
import { BodyRow, RowWrapper, useTableRowAutoWidth } from '@/pages/Order/components/BodyRow';

import { Badge, Typography } from 'antd';
import { history } from 'umi';

import { getOrderStatus, getOrderStatusColor } from '@/pages/Order/Constants';

import { MoneyText } from '@/components/Library/MoneyText';
import { MathCalcul } from '@/foundations/Support/Math';

import { subDecimal } from '@/utils/Money';

import { transformOrderStatusToLabelValue, orderStatusColorMap, orderStatusMap } from './constants';

import type { PromotionOrderColumns } from '../../api';
import { getPromotionOrder } from '../../api';

import './index.less';

const Row = RowWrapper<PromotionOrderColumns>((row) => (
  <div className="order-table-header--row">
    <Typography.Paragraph copyable={{ text: row.salsesOrderSn }}>
      订单编号：{' '}
      <a onClick={() => history.push(`/orders/sales/detail/${row.salsesOrderId}`)}>
        {row.salsesOrderSn}
      </a>
    </Typography.Paragraph>

    <div>
      {[
        ['下单时间', 'createTime', undefined],
        ['分佣奖励入账时间', 'incomeTime', { color: 'red' }] as any[],
      ]
        .filter((item) => row[item[1]])
        .map((item) => (
          <Typography.Paragraph key={item[1]} style={item[2]}>
            {item[0]}：{row[item[1]]}
          </Typography.Paragraph>
        ))}
    </div>
  </div>
));

export const PromoteOrder = () => {
  const { targetDomRef } = useTableRowAutoWidth();

  return (
    <GeneralTableLayout<PromotionOrderColumns>
      request={(params) =>
        getPromotionOrder(params).then((res) => {
          (res.data.records as PromotionOrderColumns[]).forEach((item) => {
            item.orderExtendPrice = subDecimal(item.totalMoney * item.totalRate, 2);

            item.salesExtendInfos?.forEach((v) => {
              v.extendRate = new MathCalcul(v.extendRate).multipliedBy(100).toNumber();
            });
          });

          return res;
        })
      }
      searchProps={{
        minItem: 3,
        items: [
          {
            salsesOrderSn: {
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
              title: '结算状态',
              type: 'checkableTags',
              col: 16,
              'x-component-props': {
                options: generateDefaultSelectOptions(transformOrderStatusToLabelValue),
              },
            },
          },
        ],
      }}
      operationButtonListProps={false}
      tableContainerRef={targetDomRef}
      columns={[
        {
          title: '订单状态',
          dataIndex: 'orderStatus',
          width: 100,
          render: (type) => (
            <Badge status={getOrderStatusColor(type)} text={getOrderStatus(type)} />
          ),
        },
        {
          title: '实付金额',
          dataIndex: 'totalMoney',
          width: 140,
          moneyFormatter: true,
        },
        {
          title: '订单佣金',
          dataIndex: 'orderExtendPrice',
          width: 140,
          moneyFormatter: true,
        },
        {
          title: '结算状态',
          dataIndex: 'recordedAmountOfStatus',
          width: 100,
          render: (type) => (
            <Badge status={orderStatusColorMap[type]} text={orderStatusMap[type]} />
          ),
        },
        {
          title: '下单用户',
          width: 135,
          dataIndex: 'consumerName',
        },
        {
          title: '佣金信息',
          dataIndex: 'salesExtendInfos',
          render: (v: PromotionOrderColumns['salesExtendInfos']) =>
            v?.map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <p key={index}>
                {item.extendTypeName}奖励{' '}
                <Typography.Text type="success">{item.extendRate}%</Typography.Text>:{' '}
                {item.nickName}（
                <Typography.Text type="danger">
                  <MoneyText>{item.extendPrice}</MoneyText>
                </Typography.Text>
                ）
              </p>
            )),
        },
      ]}
      tableProps={{
        bordered: false,
        className: 'order-table-wrap',
        components: {
          body: {
            row: BodyRow(Row),
          },
        },
      }}
    />
  );
};
