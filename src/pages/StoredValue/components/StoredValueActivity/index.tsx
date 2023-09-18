import { useCallback, useRef } from 'react';
import { history } from 'umi';

import type { TableActions } from '@/components/Business/Table';
import {
  convenientDateRangeSchema,
  GeneralTableLayout,
  generateDefaultSelectOptions,
} from '@/components/Business/Table';

import type { IStoredValueColumn } from '../../Api';
import { getStoredValues, delStoredValue } from '../../Api';

import { activeStatusMap, activeStatusSelectOptions, hideEditButton } from '../../Constant';

export default function StoredValueActivity() {
  const actionsRef = useRef({} as TableActions<IStoredValueColumn>);
  const goToFormPage = (item?: any) => {
    history.push({
      pathname: `/stored-values/form${(item?.id && `/${item.id}`) || ''}`,
      state: item,
    });
  };

  const goToViewPage = (item?: any) => {
    history.push({
      pathname: `/stored-values/${item.id}`,
      state: item,
    });
  };

  const handleDelete = useCallback(
    (id: string) => () => {
      delStoredValue(id).then(() => {
        actionsRef.current.reload();
      });
    },
    [],
  );

  return (
    <GeneralTableLayout<IStoredValueColumn, any>
      request={getStoredValues}
      searchProps={{
        minItem: 3,
        items: [
          {
            name: {
              title: '模糊查询',
              type: 'string',
              'x-component-props': {
                placeholder: '请输入活动名称',
              },
            },
            '[startTime,endTime]': convenientDateRangeSchema({ title: '生效时间' }),
          },
          {
            activeStatus: {
              title: '生效状态',
              type: 'checkableTags',
              'x-component-props': {
                options: generateDefaultSelectOptions(activeStatusSelectOptions),
              },
            },
          },
        ],
      }}
      defaultAddOperationButtonListProps={{
        onClick: () => goToFormPage(),
      }}
      columns={[
        {
          title: '状态',
          dataIndex: 'activeStatus',
          render: (type) => activeStatusMap[type] || '未知状态',
        },
        {
          title: '活动名称',
          dataIndex: 'name',
        },
        {
          title: '开始时间',
          dataIndex: 'startTime',
          width: 178,
        },
        {
          title: '结束时间',
          dataIndex: 'endTime',
          width: 178,
        },
        {
          title: '操作',
          dataIndex: 'id',
          width: 110,
          buttonListProps: {
            list: ({ row }) => [
              { text: '查看', onClick: () => goToViewPage(row) },
              ...(hideEditButton(Number(row.activeStatus))
                ? []
                : [{ text: '编辑', onClick: () => goToFormPage(row) }]),
              {
                text: '删除',
                popconfirmProps: {
                  title: '确定需要删除嘛？',
                  okText: '确定',
                  cancelText: '取消',
                  onConfirm: handleDelete(row.id),
                },
              },
            ],
          },
        },
      ]}
    />
  );
}
