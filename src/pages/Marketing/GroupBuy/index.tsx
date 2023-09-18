import {
  convenientDateRangeSchema,
  generateDefaultSelectOptions,
  GeneralTableLayout,
  useGeneralTableActions,
} from '@/components/Business/Table';

import { useCallback } from 'react';

import { history } from 'umi';

import { activityStatusMap } from './Constants';

import { useGroupBuyForm } from './Form';

import type { GroupBuyColumns } from '../Api';
import { getGroupBuys, updateStatus, delGroupBuy, getGroupBuy } from '../Api';

export default function MarketingGroupBuy() {
  const { actionsRef } = useGeneralTableActions<GroupBuyColumns>();
  const { openGroupBuyForm, GroupBuyFormElement } = useGroupBuyForm(() =>
    actionsRef.current.refresh(),
  );

  const updateGroupBuy = useCallback(
    (row: GroupBuyColumns) => {
      getGroupBuy(row.id).then((res) => openGroupBuyForm(res.data));
    },
    [openGroupBuyForm],
  );

  const closeGroupBuy = useCallback((row: GroupBuyColumns) => {
    updateStatus({ id: row.id, status: 2 }).then(() => actionsRef.current.refresh());
  }, []);

  const deleteGroupBuy = useCallback((row: GroupBuyColumns) => {
    delGroupBuy(row.id).then(() => actionsRef.current.refresh());
  }, []);

  const viewGroupBuy = useCallback((row: GroupBuyColumns) => {
    history.push(`/marketings/group-buys/${row.id}`);
  }, []);

  const groupBuyOrders = useCallback((row: GroupBuyColumns) => {
    history.push({
      pathname: `/marketings/group-buys/${row.id}`,
      query: {
        tabActiveKey: 'orders',
      },
    });
  }, []);

  return (
    <>
      {GroupBuyFormElement}

      <GeneralTableLayout<GroupBuyColumns>
        request={getGroupBuys}
        getActions={actionsRef}
        searchProps={{
          items: [
            {
              selectField: {
                title: '模糊查询',
                type: 'string',
                col: 8,
                'x-component-props': {
                  placeholder: '活动名称',
                },
              },
              '[startTime,endTime]': convenientDateRangeSchema({ title: '有效时间' }),
            },
            {
              status: {
                title: '活动状态',
                type: 'checkableTags',
                'x-component-props': {
                  options: generateDefaultSelectOptions([
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 },
                  ]),
                },
              },
            },
          ],
        }}
        defaultAddOperationButtonListProps={{
          text: '新增团购',
          onClick: () => openGroupBuyForm(),
        }}
        columns={[
          {
            title: '活动名称',
            dataIndex: 'activityName',
            ellipsisProps: true,
          },
          {
            title: '团购价',
            dataIndex: 'price',
            moneyFormatter: true,
          },
          {
            title: '参团人数',
            dataIndex: 'peopleNum',
          },
          {
            title: '参团订单数',
            dataIndex: 'orderNum',
          },
          {
            title: '销售额（元）',
            dataIndex: 'sales',
          },
          {
            title: '活动状态',
            dataIndex: 'showStatus',
            align: 'center',
            width: 90,
            formatterValue: ({ value }) => activityStatusMap[value],
          },
          {
            title: '有效时间',
            dataIndex: 'startTime',
            width: 340,
            formatterValue: ({ value, row }) => `${value} 至 ${row.endTime}`,
          },
          {
            title: '操作',
            dataIndex: 'showStatus',
            width: 140,
            buttonListProps: {
              list: ({ row, value }) => {
                const actions = {
                  // 未开始
                  0: [
                    { text: '编辑', onClick: () => updateGroupBuy(row) },
                    {
                      text: '删除',
                      popconfirmProps: {
                        title: '确定删除该团购活动吗？',
                        okText: '确定',
                        cancelText: '取消',
                        onConfirm: () => {
                          deleteGroupBuy(row);
                        },
                      },
                    },
                  ],
                  // 进行中
                  1: [
                    { text: '编辑', onClick: () => updateGroupBuy(row) },
                    {
                      text: '结束活动',
                      popconfirmProps: {
                        title: '确定结束该团购活动吗？',
                        okText: '确定',
                        cancelText: '取消',
                        onConfirm: () => {
                          closeGroupBuy(row);
                        },
                      },
                    },
                  ],
                  // 已结束
                  2: [
                    { text: '查看', onClick: () => viewGroupBuy(row) },
                    { text: '查看订单', onClick: () => groupBuyOrders(row) },
                  ],
                };

                return actions[value];
              },
            },
          },
        ]}
      />
    </>
  );
}
