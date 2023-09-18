import {
  useGeneralTableActions,
  GeneralTableLayout,
  generateDefaultSelectOptions,
  convenientDateRangeSchema,
} from '@/components/Business/Table';

import type { RouteChildrenProps } from '@/typings/basis';

import { history } from 'umi';

import { Badge } from 'antd';

import {
  getOrderStatus,
  getOrderStatusColor,
  transformOrderStatusToLabelValue,
  transformOrderTypeToLabelValue,
} from './Constants';
import type { PurchaseOrderColumns } from './Api';
import { getPurchaseOrderList, getSalesOrderList } from './Api';

import { BodyRow, Row, useTableRowAutoWidth } from './components/BodyRow';

export default function Order({ route }: RouteChildrenProps) {
  const isSalesOrder = route.path === '/orders/sales';

  const { actionsRef } = useGeneralTableActions<PurchaseOrderColumns>();
  const { targetDomRef } = useTableRowAutoWidth();

  const searchItem: any = isSalesOrder
    ? [
        {
          content: {
            title: '模糊查询',
            type: 'string',
            'x-component-props': {
              placeholder: '订单编号/姓名/电话',
            },
          },
          '[startTime,endTime]': convenientDateRangeSchema({ title: '下单时间' }),
        },
        {
          orderStatus: {
            title: '订单状态',
            type: 'checkableTags',
            col: 16,
            'x-component-props': {
              options: generateDefaultSelectOptions(transformOrderStatusToLabelValue),
            },
          },
        },
      ]
    : [
        {
          content: {
            title: '模糊查询',
            type: 'string',
            'x-component-props': {
              placeholder: '订单编号/姓名/电话',
            },
          },
          '[startTime,endTime]': convenientDateRangeSchema({ title: '下单时间' }),
        },
        {
          groupType: {
            title: '订单类型',
            type: 'checkableTags',
            'x-component-props': {
              options: generateDefaultSelectOptions(transformOrderTypeToLabelValue),
            },
          },
          orderStatus: {
            title: '订单状态',
            type: 'checkableTags',
            col: 16,
            'x-component-props': {
              options: generateDefaultSelectOptions(transformOrderStatusToLabelValue),
            },
          },
        },
        {
          cityId: {
            title: '收货城市',
            type: 'area',
            placeholder: '请选择地区',
            'x-component-props': {
              showAreaLevel: 2,
              isUseCode: true,
            },
          },
        },
      ];

  const columnsList: any = [
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 100,
      render: (type: any) => (
        <Badge status={getOrderStatusColor(type)} text={getOrderStatus(type)} />
      ),
    },
    {
      title: '收货姓名',
      dataIndex: 'customerName',
      ellipsisProps: true,
    },
    {
      title: '收货手机',
      width: 135,
      dataIndex: 'customerPhone',
    },
    {
      title: '收货城市',
      dataIndex: 'street',
      formatterValue: ({ row, value }: any) =>
        row.province + row.city + row.area + row.street + value,
      ellipsisProps: true,
    },
    {
      title: '订单金额',
      dataIndex: 'totalMoney',
      moneyFormatter: true,
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      width: 186,
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 110,
      buttonListProps: {
        list: ({ row }: any) => [
          {
            text: '查看详情',
            onClick: () =>
              !isSalesOrder
                ? history.push(`/orders/purchase/detail/${row.id}`)
                : history.push(`/orders/sales/detail/${row.id}`),
          },
        ],
      },
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  !isSalesOrder &&
    columnsList.splice(4, 0, {
      title: '下单商家',
      dataIndex: ['store', 'storeName'],
      ellipsisProps: true,
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  !isSalesOrder &&
    columnsList.splice(5, 0, {
      title: '商家手机',
      width: 130,
      dataIndex: ['store', 'linkPhone'],
    });

  return (
    <GeneralTableLayout<PurchaseOrderColumns, any>
      request={isSalesOrder ? getSalesOrderList : getPurchaseOrderList}
      getActions={actionsRef}
      useTableOptions={{
        formatSearchParams: (params) => ({ ...params, cityId: params?.cityId?.[1] }),
      }}
      searchProps={{
        minItem: 3,
        items: searchItem,
      }}
      operationButtonListProps={false}
      tableContainerRef={targetDomRef}
      columns={columnsList}
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
}
