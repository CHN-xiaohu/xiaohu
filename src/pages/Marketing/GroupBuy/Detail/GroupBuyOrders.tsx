import { useMemo } from 'react';

import type { TGeneralTabsDetailProperties } from '@/components/Business/GeneralTabsDetail';
import { generateDefaultSelectOptions, useGeneralTableActions } from '@/components/Business/Table';

import { ButtonList } from '@/components/Library/ButtonList';

import { orderStatusMap } from '@/pages/Order/Constants';

import { getGroupBuyOrders, groupBuyOrderRefund } from '../../Api';

export const useGroupBuyOrders = (
  groupPurchaseActiveId: string,
): TGeneralTabsDetailProperties<'Table', any> => {
  const { actionsRef } = useGeneralTableActions();

  return useMemo(
    () => ({
      title: '活动订单',
      component: 'Table',
      props: {
        request: (params) => getGroupBuyOrders({ groupPurchaseActiveId, ...params }),
        searchProps: {
          minItem: 3,
          cardProps: {
            style: {
              borderTop: 'none',
              marginTop: '-14px',
            },
            bodyStyle: {
              padding: 0,
            },
          },
          items: [
            {
              content: {
                title: '模糊查询',
                type: 'string',
                'x-component-props': {
                  placeholder: '订单编号、下单商家名称、手机号',
                },
              },
              hasPriceSpread: {
                title: '退款状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '退款成功', value: 1 },
                    { label: '退款失败', value: 2 },
                  ]),
                },
              },
            },
          ],
        },
        getActions: actionsRef,
        operationButtonListProps: false,
        tableProps: {
          rowKey: 'sn',
        },
        columns: [
          {
            title: '订单编号',
            dataIndex: 'sn',
            width: 220,
          },
          {
            title: '下单商家',
            dataIndex: 'storeName',
            render: (v, row) => `${v}（${row.linkPhone}）`,
            ellipsisProps: true,
          },
          {
            title: '订单状态',
            dataIndex: 'orderStatus',
            render: (v) => orderStatusMap[v] || '--',
          },
          {
            title: '购买数量',
            dataIndex: 'buyNum',
          },
          {
            title: '实付金额',
            dataIndex: 'totalMoney',
          },
          {
            title: '返现金额',
            dataIndex: 'hadRefundMoney',
            render: (v) => v || '--',
          },
          {
            title: '退款状态',
            dataIndex: 'hasPriceSpread',
            render: (v, row) => {
              if (Number(v) === 1) {
                return '退款成功';
              }

              if (Number(v) === 2) {
                return (
                  <div>
                    <p>我是退款原因占位</p>
                    <ButtonList
                      list={[
                        {
                          text: '退款',
                          type: 'primary',
                          onClick: () => {
                            groupBuyOrderRefund(row.orderId).then(() =>
                              actionsRef.current.reload(),
                            );
                          },
                        },
                      ]}
                    />
                  </div>
                );
              }

              return '--';
            },
          },
        ],
      },
    }),
    [],
  );
};
